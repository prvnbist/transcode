import { Link, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		// Keep search values as raw strings: the default parser JSON-decodes
		// them, which would turn a shared input like {"a":1} into an object
		parseSearch: search => Object.fromEntries(new URLSearchParams(search)),
		stringifySearch: search => {
			const params = new URLSearchParams()
			for (const [key, value] of Object.entries(search)) {
				if (value !== undefined && value !== null) {
					params.set(key, String(value))
				}
			}
			const query = params.toString()
			return query ? `?${query}` : ''
		},
		defaultNotFoundComponent: () => (
			<main className="flex flex-1 flex-col items-center justify-center gap-2">
				<h1 className="text-lg font-semibold">Page not found</h1>
				<Link to="/" className="text-accent hover:underline">
					Back to Transcode
				</Link>
			</main>
		),
		defaultPreload: 'intent',
		defaultPreloadStaleTime: 0
	})
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
