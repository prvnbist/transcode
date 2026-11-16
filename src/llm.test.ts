import { describe, expect, it } from 'vite-plus/test'

import { buildLlmDoc } from './llm'
import { tools } from './tools'

describe('buildLlmDoc', () => {
	const doc = buildLlmDoc()

	it('starts with an H1', () => {
		expect(doc.startsWith('# Transcode')).toBe(true)
	})

	it('lists every converter endpoint', () => {
		for (const tool of tools)
			for (const t of tool.translators)
				expect(doc).toContain(`POST /api/${tool.slug}/${t.slug}`)
	})

	it('documents limits and status codes', () => {
		for (const s of ['100 KB', '400', '404', '413', '422'])
			expect(doc).toContain(s)
	})
})
