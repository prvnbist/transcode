import { createFileRoute } from '@tanstack/react-router'

import { absoluteUrl } from '#/seo'
import { tools } from '#/tools'

// Approximates the deploy date: evaluated once when the server starts
const lastmod = new Date().toISOString().slice(0, 10)

export const Route = createFileRoute('/sitemap.xml')({
	server: {
		handlers: {
			GET: () => {
				const paths = tools.flatMap(tool =>
					tool.translators.map(t => `/${tool.slug}/${t.slug}`)
				)
				const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(p => `	<url><loc>${absoluteUrl(p)}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
				return new Response(body, {
					headers: {
						'Content-Type': 'application/xml; charset=utf-8',
						'Cache-Control': 'public, max-age=3600'
					}
				})
			}
		}
	}
})
