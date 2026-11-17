import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute
} from '@tanstack/react-router'
import { PostHogProvider } from '@posthog/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import Header from '#/components/Header'
import {
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_TITLE,
	SITE_URL,
	pageHead
} from '#/seo'
import appCss from '#/styles.css?url'

// Optional, set in the hosting environment (e.g. Vercel project settings)
const SEARCH_CONSOLE_TOKEN = import.meta.env.VITE_SEARCH_CONSOLE_TOKEN as
	| string
	| undefined
const POSTHOG_PROJECT_TOKEN = import.meta.env
	.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN as string | undefined
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST as
	| string
	| undefined

if (
	typeof window !== 'undefined' &&
	!POSTHOG_PROJECT_TOKEN &&
	import.meta.env.DEV
) {
	throw new Error(
		'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
	)
}

if (typeof window !== 'undefined' && !POSTHOG_HOST && import.meta.env.DEV) {
	throw new Error(
		'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
	)
}

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{ name: 'theme-color', content: '#08090a' },
			{ name: 'author', content: 'Praveen Bisht' },
			...(SEARCH_CONSOLE_TOKEN
				? [
						{
							name: 'google-site-verification',
							content: SEARCH_CONSOLE_TOKEN
						}
					]
				: []),
			{
				name: 'robots',
				content: 'index, follow, max-image-preview:large'
			},
			...pageHead({
				title: SITE_TITLE,
				description: SITE_DESCRIPTION,
				path: '/',
				jsonLd: {
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					'@id': `${SITE_URL}/#website`,
					name: SITE_NAME,
					url: SITE_URL,
					description: SITE_DESCRIPTION
				}
			}).meta
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
			{
				rel: 'icon',
				href: '/favicon-48.png',
				type: 'image/png',
				sizes: '48x48'
			},
			{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
			{ rel: 'manifest', href: '/manifest.webmanifest' },
			{ rel: 'alternate', type: 'text/markdown', href: '/LLM.md' }
		]
	}),
	shellComponent: RootDocument,
	component: RootLayout
})

function RootDocument({ children }: { children: React.ReactNode }) {
	const app = (
		<>
			{children}
			<Analytics />
			<SpeedInsights />
		</>
	)

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{POSTHOG_PROJECT_TOKEN && POSTHOG_HOST ? (
					<PostHogProvider
						apiKey={POSTHOG_PROJECT_TOKEN}
						options={{
							api_host: POSTHOG_HOST,
							capture_exceptions: true,
							debug: import.meta.env.DEV
						}}
					>
						{app}
					</PostHogProvider>
				) : (
					app
				)}
				<Scripts />
			</body>
		</html>
	)
}

function RootLayout() {
	return (
		<div className="flex min-h-dvh w-full flex-col text-[13px]">
			<Header />
			<Outlet />
		</div>
	)
}
