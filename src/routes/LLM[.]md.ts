import { createFileRoute } from '@tanstack/react-router'

import { buildLlmDoc } from '#/llm'

export const Route = createFileRoute('/LLM.md')({
	server: {
		handlers: {
			GET: () =>
				new Response(buildLlmDoc(), {
					headers: {
						'Content-Type': 'text/markdown; charset=utf-8',
						'Cache-Control': 'public, max-age=3600'
					}
				})
		}
	}
})
