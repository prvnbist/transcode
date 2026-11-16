import { describe, expect, it } from 'vite-plus/test'

import { handleMcp } from './mcp'

const rpc = async (method: string, params: unknown = {}, id = 1) => {
	const res = await handleMcp(
		new Request('http://localhost/mcp', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json, text/event-stream'
			},
			body: JSON.stringify({ jsonrpc: '2.0', id, method, params })
		})
	)
	return { res, body: await res.json() }
}

const init = {
	protocolVersion: '2025-03-26',
	capabilities: {},
	clientInfo: { name: 'test', version: '0' }
}

describe('mcp', () => {
	it('initializes', async () => {
		const { body } = await rpc('initialize', init)
		expect(body.result.serverInfo).toBeTruthy()
	})

	it('lists tools', async () => {
		const { body } = await rpc('tools/list')
		expect(body.result.tools.map((t: { name: string }) => t.name)).toEqual([
			'list_converters',
			'convert'
		])
	})

	it('converts', async () => {
		const { body } = await rpc('tools/call', {
			name: 'convert',
			arguments: {
				tool: 'text',
				translator: 'camel-case',
				input: 'hello world'
			}
		})
		expect(body.result.content[0].text).toBe('helloWorld')
	})

	it('flags unknown converters as errors', async () => {
		const { body } = await rpc('tools/call', {
			name: 'convert',
			arguments: { tool: 'nope', translator: 'x', input: 'a' }
		})
		expect(body.result.isError).toBe(true)
	})

	it('filters list_converters', async () => {
		const { body } = await rpc('tools/call', {
			name: 'list_converters',
			arguments: { query: 'camel' }
		})
		expect(body.result.content[0].text).toContain('camel-case')
	})
})
