import { content } from '#/content'
import type { Tool, Translator } from '#/tools'

export const SITE_URL = 'https://transcode.prvnbist.com'
export const SITE_NAME = 'Transcode'
export const SITE_TITLE = 'Transcode - Free Online Text, Code & Data Converters'
export const SITE_DESCRIPTION =
	'Free online developer tools to convert, format and encode text, JSON, YAML, CSV, XML, HTML, CSS, SQL, colors, hashes, timestamps and more. No sign-up required.'
export const OG_IMAGE = `${SITE_URL}/og.png`

/** Tools where translators read as a target format: "JSON to YAML". */
const SOURCE_FORMATS = new Set(['json', 'yaml', 'csv', 'xml', 'html', 'css'])
const ACTIONS = new Set(['format', 'minify', 'encode', 'decode', 'parse'])

/** Human readable name for a translator, e.g. "JSON to YAML", "URL Encode". */
export function toolName(tool: Tool, translator: Translator) {
	const label = translator.label
	if (label.includes(' to ')) return label
	if (ACTIONS.has(translator.slug)) return `${tool.label} ${label}`
	if (SOURCE_FORMATS.has(tool.slug)) return `${tool.label} to ${label}`
	if (tool.slug === 'hash') return `${label} Hash Generator`
	if (tool.slug === 'text' || tool.slug === 'encoding') return label
	return `${tool.label} ${label}`
}

export function absoluteUrl(path: string) {
	return `${SITE_URL}${path === '/' ? '' : path}`
}

export function pageHead({
	title,
	description,
	path,
	jsonLd
}: {
	title: string
	description: string
	path: string
	jsonLd?: Record<string, unknown>
}) {
	const url = absoluteUrl(path)
	return {
		meta: [
			{ title },
			{ name: 'description', content: description },
			{ property: 'og:type', content: 'website' },
			{ property: 'og:site_name', content: SITE_NAME },
			{ property: 'og:title', content: title },
			{ property: 'og:description', content: description },
			{ property: 'og:url', content: url },
			{ property: 'og:image', content: OG_IMAGE },
			{ property: 'og:image:width', content: '1200' },
			{ property: 'og:image:height', content: '630' },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:title', content: title },
			{ name: 'twitter:description', content: description },
			{ name: 'twitter:image', content: OG_IMAGE },
			...(jsonLd ? [{ 'script:ld+json': jsonLd }] : [])
		],
		links: [{ rel: 'canonical', href: url }]
	}
}

export function translatorHead(
	tool: Tool,
	translator: Translator,
	{ noindex = false }: { noindex?: boolean } = {}
) {
	const name = toolName(tool, translator)
	const path = `/${tool.slug}/${translator.slug}`
	const title = `${name} Online | ${SITE_NAME}`
	const base = `Free online ${name} tool.`
	const intro = content[tool.slug]?.intro ?? ''
	// Keep within the ~160 characters search engines show
	const description =
		`${base} ${intro} No sign-up required.`.length <= 160
			? `${base} ${intro} No sign-up required.`
			: `${base} Instant results in your browser, no sign-up required.`
	const faqs = content[tool.slug]?.faqs ?? []
	const head = pageHead({
		title,
		description,
		path,
		jsonLd: {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebApplication',
					name: `${name} | ${SITE_NAME}`,
					url: absoluteUrl(path),
					description,
					applicationCategory: 'DeveloperApplication',
					operatingSystem: 'Any',
					browserRequirements: 'Requires JavaScript',
					isAccessibleForFree: true,
					offers: {
						'@type': 'Offer',
						price: '0',
						priceCurrency: 'USD'
					},
					isPartOf: { '@id': `${SITE_URL}/#website` }
				},
				...(faqs.length
					? [
							{
								'@type': 'FAQPage',
								mainEntity: faqs.map(f => ({
									'@type': 'Question',
									name: f.q,
									acceptedAnswer: {
										'@type': 'Answer',
										text: f.a
									}
								}))
							}
						]
					: []),
				{
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: SITE_NAME,
							item: SITE_URL
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: tool.label,
							item: absoluteUrl(path)
						},
						{
							'@type': 'ListItem',
							position: 3,
							name,
							item: absoluteUrl(path)
						}
					]
				}
			]
		}
	})
	if (noindex) head.meta.push({ name: 'robots', content: 'noindex, follow' })
	return head
}
