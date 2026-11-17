import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
	BatchLogRecordProcessor,
	LoggerProvider
} from '@opentelemetry/sdk-logs'

let logger: Logger | null = null
let provider: LoggerProvider | null = null

function warnMissingConfig(variable: string) {
	if (import.meta.env.DEV) {
		console.warn(
			`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
		)
	}
}

export function getPostHogLogLogger() {
	if (logger) return logger

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

	try {
		provider = new LoggerProvider({
			resource: resourceFromAttributes({
				'service.name': 'transcode-api'
			}),
			processors: [
				new BatchLogRecordProcessor({
					exporter: new OTLPLogExporter({
						url: new URL('/i/v1/logs', host).toString(),
						headers: { Authorization: `Bearer ${token}` }
					}),
					exportTimeoutMillis: 2000
				})
			]
		})
		logger = provider.getLogger('transcode.posthog')
		return logger
	} catch {
		if (import.meta.env.DEV) {
			console.warn('PostHog log capture could not be initialized.')
		}
		return null
	}
}

export async function flushPostHogLogs() {
	await provider?.forceFlush().catch(() => {})
}
