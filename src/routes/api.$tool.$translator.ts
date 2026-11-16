import { createFileRoute } from '@tanstack/react-router'

import { handleConvert, optionsResponse } from '#/api'

export const Route = createFileRoute('/api/$tool/$translator')({
	server: {
		handlers: {
			OPTIONS: () => optionsResponse(),
			GET: ({ request, params }) => handleConvert(request, params),
			POST: ({ request, params }) => handleConvert(request, params)
		}
	}
})
