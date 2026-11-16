import { content } from '#/content'
import {
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
	absoluteUrl,
	toolName
} from '#/seo'
import { tools } from '#/tools'

/** Markdown guide for LLMs and agents, generated from the tool registry. */
export function buildLlmDoc() {
	const sections = tools.map(tool => {
		const intro = content[tool.slug]?.intro ?? ''
		const rows = tool.translators.map(t => {
			const path = `${tool.slug}/${t.slug}`
			return `- **${toolName(tool, t)}**: \`POST /api/${path}\` ([page](${absoluteUrl(`/${path}`)}))`
		})
		return [`### ${tool.label}`, intro, rows.join('\n')]
			.filter(Boolean)
			.join('\n\n')
	})

	return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} converts text between formats. Every converter on the website is also available as a free HTTP API that needs no authentication. Nothing is stored.

## API

Base URL: ${SITE_URL}

Each converter lives at \`/api/{tool}/{translator}\`. \`GET ${SITE_URL}/api\` returns the full machine-readable list of endpoints.

\`\`\`bash
# JSON in, JSON out
curl -X POST ${SITE_URL}/api/json/yaml \\
  -H 'content-type: application/json' -d '{"input":"{\\"a\\":1}"}'
# => { "tool": "json", "translator": "yaml", "output": "a: 1\\n" }

# Raw text in, plain text out
curl -X POST ${SITE_URL}/api/text/camel-case \\
  -H 'accept: text/plain' -d 'hello world'

# Short inputs via GET
curl '${SITE_URL}/api/encoding/base64-encode?input=hello&format=text'
\`\`\`

- Input is capped at 100 KB. CORS is open.
- Status codes: \`200\` ok, \`400\` bad request, \`404\` unknown converter, \`413\` input too large, \`422\` the converter rejected the input (\`error\` holds the message).
- A non-fatal \`warning\` field may accompany a \`200\` response.

## MCP

A remote MCP server (Streamable HTTP) is available at \`${SITE_URL}/mcp\` with two tools: \`list_converters\` and \`convert\`.

Human-readable docs: ${absoluteUrl('/docs')}

## Converters

${sections.join('\n\n')}
`
}
