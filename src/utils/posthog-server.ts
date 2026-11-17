import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null

function warnMissingConfig(variable: string) {
	if (import.meta.env.DEV) {
		console.warn(
			`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
		)
	}
}

export function getPostHogClient() {
	const token =
		process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
		import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
	const host =
		process.env.VITE_PUBLIC_POSTHOG_HOST ??
		import.meta.env.VITE_PUBLIC_POSTHOG_HOST

	if (!token) {
		warnMissingConfig('VITE_PUBLIC_POSTHOG_PROJECT_TOKEN')
		return null
	}
	if (!host) {
		warnMissingConfig('VITE_PUBLIC_POSTHOG_HOST')
		return null
	}

	if (!posthogClient) {
		posthogClient = new PostHog(token, {
			host,
			enableExceptionAutocapture: true,
			flushAt: 1,
			flushInterval: 0,
			requestTimeout: 2000,
			fetchRetryCount: 0
		})
	}

	return posthogClient
}
