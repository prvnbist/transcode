import { createFileRoute, notFound } from '@tanstack/react-router'

import About from '#/components/About'
import Layout from '#/components/Layout'
import { getExample } from '#/examples'
import { translatorHead } from '#/seo'
import { findTranslator } from '#/tools'

// Run on the server, and the result is reused on the client
const MAX_SHARED_INPUT = 4000
const SKIP_OUTPUT = new Set(['html/pug', 'html/jsx'])

export const Route = createFileRoute('/$tool/$translator')({
	validateSearch: (search: Record<string, unknown>): { input?: string } => ({
		input:
			typeof search.input === 'string' &&
			search.input.length <= MAX_SHARED_INPUT
				? search.input
				: undefined
	}),
	beforeLoad: ({ params }) => {
		if (!findTranslator(params.tool, params.translator)) throw notFound()
	},
	loader: async ({ params }) => {
		const found = findTranslator(params.tool, params.translator)
		if (!found) return { exampleOutput: '' }
		const key = `${params.tool}/${params.translator}`
		// Random output (UUIDs, lorem ipsum) makes a poor static example
		if (SKIP_OUTPUT.has(key) || params.tool === 'generate') {
			return { exampleOutput: '' }
		}
		try {
			const example = getExample(params.tool, params.translator)
			return {
				exampleOutput: (await found.translator.convert(example)) || ''
			}
		} catch {
			return { exampleOutput: '' }
		}
	},
	head: ({ params, match }) => {
		const found = findTranslator(params.tool, params.translator)
		// Shared-input URLs are duplicates of the plain page
		const noindex = Boolean(match.search.input)
		return found
			? translatorHead(found.tool, found.translator, { noindex })
			: {}
	},
	component: Page
})

function Page() {
	const { tool, translator } = Route.useParams()
	const { exampleOutput } = Route.useLoaderData()
	const { input } = Route.useSearch()
	const found = findTranslator(tool, translator)
	if (!found) return null
	const example = tool === 'generate' ? '' : getExample(tool, translator)
	return (
		<>
			{/* key resets input/output when switching translators */}
			<div className="flex h-[calc(100dvh-3rem)] flex-col">
				<Layout
					key={`${tool}/${translator}`}
					{...found}
					initialInput={input}
				/>
			</div>
			<About {...found} example={example} exampleOutput={exampleOutput} />
		</>
	)
}
