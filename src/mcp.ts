import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'

import { converterList, runConvert } from '#/api'
import { SITE_NAME } from '#/seo'

export function createMcpServer() {
	const server = new McpServer({ name: SITE_NAME, version: '1.0.0' })

	server.registerTool(
		'list_converters',
		{
			description:
				'List available converters (e.g. json/yaml, text/camel-case). Optionally filter by tool slug or a search query.',
			inputSchema: {
				tool: z.string().optional().describe('Tool slug, e.g. "json"'),
				query: z
					.string()
					.optional()
					.describe('Case-insensitive search over names and slugs')
			}
		},
		async ({ tool, query }) => {
			const q = query?.toLowerCase()
			const list = converterList().filter(
				c =>
					(!tool || c.tool === tool) &&
					(!q ||
						`${c.name} ${c.tool} ${c.translator}`
							.toLowerCase()
							.includes(q))
			)
			return {
				content: [{ type: 'text', text: JSON.stringify(list, null, 2) }]
			}
		}
	)

	server.registerTool(
		'convert',
		{
			description:
				'Run a converter on text. Use list_converters to discover tool/translator slugs. Input is capped at 100 KB.',
			inputSchema: {
				tool: z.string().describe('Tool slug, e.g. "text"'),
				translator: z
					.string()
					.describe('Translator slug, e.g. "camel-case"'),
				input: z.string().describe('Text to convert')
			}
		},
		async ({ tool, translator, input }) => {
			const res = await runConvert(tool, translator, input)
			if (!res.ok) {
				return {
					isError: true,
					content: [{ type: 'text', text: res.error }]
				}
			}
			return {
				content: [
					{ type: 'text', text: res.output },
					...(res.warning
						? [
								{
									type: 'text' as const,
									text: `Warning: ${res.warning}`
								}
							]
						: [])
				]
			}
		}
	)

	return server
}

const CORS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
	'Access-Control-Allow-Headers':
		'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
	'Access-Control-Expose-Headers': 'Mcp-Session-Id'
}

export const mcpOptions = () =>
	new Response(null, { status: 204, headers: CORS })

/** Stateless: a fresh server and transport per request. */
export async function handleMcp(request: Request): Promise<Response> {
	const server = createMcpServer()
	const transport = new WebStandardStreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
		enableJsonResponse: true
	})
	await server.connect(transport)
	const res = await transport.handleRequest(request)
	const headers = new Headers(res.headers)
	for (const [k, v] of Object.entries(CORS)) headers.set(k, v)
	return new Response(res.body, { status: res.status, headers })
}
