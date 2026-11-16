import { describe, expect, it } from 'vite-plus/test'

import { content, inverseOf, relatedTools } from './content'
import { tools } from './tools'

describe('content', () => {
	for (const tool of tools) {
		it(`${tool.slug} has an intro and FAQs`, () => {
			const info = content[tool.slug]
			expect(info?.intro.length).toBeGreaterThan(20)
			expect(info?.faqs.length).toBeGreaterThan(0)
		})
	}

	it('has no content for unknown tools', () => {
		const slugs = new Set(tools.map(t => t.slug))
		for (const key of Object.keys(content))
			expect(slugs.has(key)).toBe(true)
	})

	it('inverse converters point back at each other', () => {
		for (const tool of tools) {
			for (const translator of tool.translators) {
				const inverse = inverseOf(tool, translator)
				if (!inverse) continue
				const back = inverseOf(inverse.tool, inverse.translator)
				expect(back?.translator.slug).toBe(translator.slug)
			}
		}
	})

	it('related tools never include the page itself', () => {
		for (const tool of tools) {
			for (const translator of tool.translators) {
				for (const r of relatedTools(tool, translator)) {
					expect(
						r.tool.slug === tool.slug &&
							r.translator.slug === translator.slug
					).toBe(false)
				}
			}
		}
	})
})
