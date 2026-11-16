import { createFileRoute } from '@tanstack/react-router'

import { apiIndex, optionsResponse } from '#/api'

export const Route = createFileRoute('/api/')({
	server: {
		handlers: {
			OPTIONS: () => optionsResponse(),
			GET: () => apiIndex()
		}
	}
})
