import { createFileRoute } from '@tanstack/react-router'

import { handleMcp, mcpOptions } from '#/mcp'

export const Route = createFileRoute('/mcp')({
	server: {
		handlers: {
			OPTIONS: () => mcpOptions(),
			GET: ({ request }) => handleMcp(request),
			POST: ({ request }) => handleMcp(request),
			DELETE: ({ request }) => handleMcp(request)
		}
	}
})
