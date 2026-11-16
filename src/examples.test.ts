import { describe, expect, it } from 'vite-plus/test'

import { looksLikeError } from './api'
import { getExample } from './examples'
import { tools } from './tools'

// Server functions can't run in unit tests
const SERVER_ONLY = new Set(['html/pug', 'html/jsx'])

describe('examples', () => {
	for (const tool of tools) {
		for (const translator of tool.translators) {
			const key = `${tool.slug}/${translator.slug}`
			it(`${key} has a working example`, async () => {
				const example = getExample(tool.slug, translator.slug)
				expect(example).not.toBe('')
				expect(translator.validate?.(example) ?? '').toBe('')
				if (SERVER_ONLY.has(key)) return
				const output = await translator.convert(example)
				expect(output).not.toBe('')
				expect(looksLikeError(output)).toBe(false)
			})
		}
	}
})
