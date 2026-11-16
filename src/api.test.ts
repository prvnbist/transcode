import { describe, expect, it } from 'vite-plus/test'

import {
	apiIndex,
	handleConvert,
	MAX_INPUT_BYTES,
	optionsResponse
} from './api'
import { getExample } from './examples'
import { tools } from './tools'

const BASE = 'http://localhost/api'
const post = (path: string, body: string, headers: HeadersInit = {}) =>
	new Request(`${BASE}/${path}`, { method: 'POST', body, headers })
const params = (path: string) => {
	const [tool, translator] = path.split('/')
	return { tool, translator }
}

describe('api', () => {
	it('converts a JSON body', async () => {
		const res = await handleConvert(
			post('text/camel-case', JSON.stringify({ input: 'hello world' }), {
				'content-type': 'application/json'
			}),
			params('text/camel-case')
		)
		expect(res.status).toBe(200)
		expect(res.headers.get('access-control-allow-origin')).toBe('*')
		expect(await res.json()).toMatchObject({ output: 'helloWorld' })
	})

	it('converts a text body and can answer in plain text', async () => {
		const res = await handleConvert(
			post('text/camel-case', 'hello world', {
				'content-type': 'text/plain',
				accept: 'text/plain'
			}),
			params('text/camel-case')
		)
		expect(res.headers.get('content-type')).toContain('text/plain')
		expect(await res.text()).toBe('helloWorld')
	})

	it('supports GET ?input=', async () => {
		const res = await handleConvert(
			new Request(`${BASE}/text/camel-case?input=foo%20bar`),
			params('text/camel-case')
		)
		expect(await res.json()).toMatchObject({ output: 'fooBar' })
	})

	it('404s on unknown converters', async () => {
		const res = await handleConvert(
			post('nope/nothing', 'x'),
			params('nope/nothing')
		)
		expect(res.status).toBe(404)
	})

	it('400s on malformed JSON', async () => {
		const res = await handleConvert(
			post('text/camel-case', '{oops', {
				'content-type': 'application/json'
			}),
			params('text/camel-case')
		)
		expect(res.status).toBe(400)
	})

	it('413s on oversized input', async () => {
		const res = await handleConvert(
			post('text/camel-case', 'a'.repeat(MAX_INPUT_BYTES + 1)),
			params('text/camel-case')
		)
		expect(res.status).toBe(413)
	})

	it('422s when the converter reports an error', async () => {
		const res = await handleConvert(
			post('jwt/decode', 'not-a-jwt'),
			params('jwt/decode')
		)
		expect(res.status).toBe(422)
		expect(await res.json()).toHaveProperty('error')
	})

	it('answers OPTIONS and lists endpoints', async () => {
		expect(optionsResponse().status).toBe(204)
		const index = await apiIndex().json()
		expect(index.endpoints.length).toBe(
			tools.reduce((n, t) => n + t.translators.length, 0)
		)
	})

	// Server functions can't run in unit tests
	const SERVER_ONLY = new Set(['html/pug', 'html/jsx'])
	for (const tool of tools) {
		for (const translator of tool.translators) {
			const key = `${tool.slug}/${translator.slug}`
			if (SERVER_ONLY.has(key)) continue
			it(`${key} returns 200 for its example`, async () => {
				const res = await handleConvert(
					post(key, getExample(tool.slug, translator.slug)),
					params(key)
				)
				expect(res.status).toBe(200)
			})
		}
	}
})
