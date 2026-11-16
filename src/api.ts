import { absoluteUrl, toolName } from '#/seo'
import { findTranslator, tools } from '#/tools'

export const MAX_INPUT_BYTES = 100 * 1024

/** Converters report failures as plain strings; this detects them. */
export const ERROR_PATTERN =
	/try again|please (enter|input)|invalid|could not|went wrong|omitted/i

export const looksLikeError = (output: string) => ERROR_PATTERN.test(output)

const CORS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Accept'
}

const json = (body: unknown, status = 200, extra: HeadersInit = {}) =>
	new Response(JSON.stringify(body, null, 2) + '\n', {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-store',
			...CORS,
			...extra
		}
	})

const text = (body: string, status = 200) =>
	new Response(body, {
		status,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'no-store',
			...CORS
		}
	})

export const optionsResponse = () =>
	new Response(null, { status: 204, headers: CORS })

const byteLength = (s: string) => new TextEncoder().encode(s).length

const tooLarge = () =>
	json(
		{ error: `Input is too large (max ${MAX_INPUT_BYTES / 1024} KB).` },
		413
	)

async function readInput(request: Request): Promise<string | Response> {
	const url = new URL(request.url)
	if (request.method === 'GET') {
		const input = url.searchParams.get('input')
		if (input === null) {
			return json({ error: 'Missing "input" query parameter.' }, 400)
		}
		return byteLength(input) > MAX_INPUT_BYTES ? tooLarge() : input
	}

	const length = Number(request.headers.get('content-length') ?? 0)
	if (length > MAX_INPUT_BYTES * 2) return tooLarge()

	const raw = await request.text()
	let input = raw
	if ((request.headers.get('content-type') ?? '').includes('json')) {
		try {
			const body = JSON.parse(raw)
			if (!body || typeof body.input !== 'string') {
				return json(
					{ error: 'JSON body must be { "input": "<string>" }.' },
					400
				)
			}
			input = body.input
		} catch {
			return json({ error: 'Request body is not valid JSON.' }, 400)
		}
	}
	return byteLength(input) > MAX_INPUT_BYTES ? tooLarge() : input
}

export type ConvertResult =
	| {
			ok: true
			tool: string
			translator: string
			output: string
			warning: string
	  }
	| {
			ok: false
			status: number
			error: string
			tool?: string
			translator?: string
	  }

/** Shared by the HTTP API and the MCP server so limits and errors stay identical. */
export async function runConvert(
	toolSlug: string,
	translatorSlug: string,
	input: string
): Promise<ConvertResult> {
	const found = findTranslator(toolSlug, translatorSlug)
	if (!found) {
		return {
			ok: false,
			status: 404,
			error: `Unknown converter "${toolSlug}/${translatorSlug}". See /api for the list.`
		}
	}
	const { tool, translator } = found
	if (byteLength(input) > MAX_INPUT_BYTES) {
		return {
			ok: false,
			status: 413,
			error: `Input is too large (max ${MAX_INPUT_BYTES / 1024} KB).`
		}
	}
	try {
		const warning = translator.validate?.(input) ?? ''
		const output = (await translator.convert(input)) || ''
		if (looksLikeError(output)) {
			return {
				ok: false,
				status: 422,
				error: output,
				tool: tool.slug,
				translator: translator.slug
			}
		}
		return {
			ok: true,
			tool: tool.slug,
			translator: translator.slug,
			output,
			warning
		}
	} catch (error) {
		return {
			ok: false,
			status: 500,
			error: error instanceof Error ? error.message : 'Conversion failed.'
		}
	}
}

export async function handleConvert(
	request: Request,
	params: { tool: string; translator: string }
): Promise<Response> {
	const url = new URL(request.url)
	try {
		const input = await readInput(request)
		if (input instanceof Response) return input

		const res = await runConvert(params.tool, params.translator, input)
		if (!res.ok) {
			const { status, ok: _ok, ...body } = res
			return json(body, status)
		}

		const wantsText =
			url.searchParams.get('format') === 'text' ||
			(request.headers.get('accept') ?? '').startsWith('text/plain')
		if (wantsText) return text(res.output)

		return json({
			tool: res.tool,
			translator: res.translator,
			output: res.output,
			...(res.warning ? { warning: res.warning } : {})
		})
	} catch (error) {
		return json(
			{
				error:
					error instanceof Error
						? error.message
						: 'Conversion failed.'
			},
			500
		)
	}
}

export const converterList = () =>
	tools.flatMap(tool =>
		tool.translators.map(t => ({
			tool: tool.slug,
			translator: t.slug,
			name: toolName(tool, t),
			inputLanguage: t.inputLanguage ?? tool.inputLanguage,
			outputLanguage: t.outputLanguage ?? 'plaintext'
		}))
	)

export const apiIndex = () =>
	json({
		name: 'Transcode API',
		usage: {
			post_json: 'POST /api/{tool}/{translator} with {"input": "..."}',
			post_text: 'POST /api/{tool}/{translator} with a text/plain body',
			get: 'GET /api/{tool}/{translator}?input=...',
			plain_output: 'Send "Accept: text/plain" or add ?format=text',
			limits: `Input is capped at ${MAX_INPUT_BYTES / 1024} KB.`,
			errors: '404 unknown converter, 413 too large, 422 invalid input',
			mcp: absoluteUrl('/mcp')
		},
		endpoints: tools.flatMap(tool =>
			tool.translators.map(t => ({
				name: toolName(tool, t),
				path: `/api/${tool.slug}/${t.slug}`,
				url: absoluteUrl(`/api/${tool.slug}/${t.slug}`),
				inputLanguage: t.inputLanguage ?? tool.inputLanguage,
				outputLanguage: t.outputLanguage ?? 'plaintext'
			}))
		)
	})
