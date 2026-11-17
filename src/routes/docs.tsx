import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import CodeBlock from '#/components/CodeBlock'
import { SITE_URL, pageHead } from '#/seo'
import { tools } from '#/tools'

export const Route = createFileRoute('/docs')({
	head: () =>
		pageHead({
			title: 'API, MCP & LLM Docs | Transcode',
			description:
				'Use Transcode from code: the free HTTP API, the remote MCP server for AI agents, and the LLM.md guide. No authentication required.',
			path: '/docs'
		}),
	component: Docs
})

const SECTIONS = [
	['overview', 'Overview'],
	['api', 'HTTP API'],
	['errors', 'Errors'],
	['mcp', 'MCP server'],
	['llm', 'LLM usage'],
	['faq', 'FAQ'],
	['converters', 'Converters']
] as const

const STATUS: Array<[string, string]> = [
	['200', 'Converted successfully. A non-fatal "warning" may be included.'],
	['400', 'Bad request: missing "input", or the JSON body is malformed.'],
	['404', 'Unknown converter. See GET /api for the list.'],
	['413', 'Input is larger than 100 KB.'],
	['422', 'The converter rejected the input. "error" holds the message.'],
	['429', 'Rate limit exceeded (60 requests/minute per IP). Wait and retry.'],
	['500', 'Unexpected server error.']
]

const FAQS: Array<[string, string]> = [
	[
		'Do I need an API key?',
		'No. The API and MCP server are open and free, with no sign-in.'
	],
	[
		'Is my input stored?',
		'No. Input is converted and returned; nothing is stored.'
	],
	[
		'Is there a rate limit?',
		'Yes: 60 requests per minute per IP across /api and /mcp. Exceeding it returns 429. Inputs are capped at 100 KB.'
	],
	[
		'Can I call it from the browser?',
		'Yes. CORS is open for any origin on /api and /mcp.'
	],
	[
		'How do I find the right converter slug?',
		'Call GET /api or the list_converters MCP tool, or browse the list at the bottom of this page.'
	]
]

function C({ children }: { children: ReactNode }) {
	return (
		<code className="rounded bg-elevated px-1 py-0.5 font-mono text-[12px] text-fg">
			{children}
		</code>
	)
}

function Section({
	id,
	title,
	children
}: {
	id: string
	title: string
	children: ReactNode
}) {
	return (
		<section id={id} className="scroll-mt-16 border-t border-line py-8">
			<h2 className="mb-3 text-[17px] font-semibold tracking-tight text-fg">
				{title}
			</h2>
			<div className="space-y-3">{children}</div>
		</section>
	)
}

function H3({ children }: { children: ReactNode }) {
	return <h3 className="pt-2 font-medium text-fg">{children}</h3>
}

function Table({ rows }: { rows: Array<[ReactNode, ReactNode, ReactNode?]> }) {
	return (
		<div className="overflow-x-auto rounded-md border border-line">
			<table className="w-full text-left text-[13px]">
				<tbody>
					{rows.map(([a, b, c], i) => (
						<tr
							key={i}
							className="border-b border-line last:border-0"
						>
							<th className="px-3 py-2 align-top font-mono font-medium whitespace-nowrap text-fg">
								{a}
							</th>
							<td className="px-3 py-2 align-top">{b}</td>
							{c !== undefined && (
								<td className="px-3 py-2 align-top">{c}</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

/** Highlights the section currently in view. */
function useActiveSection() {
	const [active, setActive] = useState<string>(SECTIONS[0][0])
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				const visible = entries.find(e => e.isIntersecting)
				if (visible) setActive(visible.target.id)
			},
			{ rootMargin: '-56px 0px -70% 0px' }
		)
		for (const [id] of SECTIONS) {
			const el = document.getElementById(id)
			if (el) observer.observe(el)
		}
		return () => observer.disconnect()
	}, [])
	return active
}

// --- Snippets ---------------------------------------------------------------

const API_EXAMPLES = [
	{
		label: 'curl',
		code: `curl -X POST ${SITE_URL}/api/json/yaml \\
  -H 'content-type: application/json' \\
  -d '{"input":"{\\"a\\":1}"}'`
	},
	{
		label: 'JavaScript',
		code: `const res = await fetch('${SITE_URL}/api/json/yaml', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ input: '{"a":1}' })
})
const { output } = await res.json()
console.log(output) // "a: 1\\n"`
	},
	{
		label: 'Python',
		code: `import requests

res = requests.post(
    "${SITE_URL}/api/json/yaml",
    json={"input": '{"a":1}'},
)
print(res.json()["output"])  # "a: 1\\n"`
	}
]

const RESPONSE = `{
  "tool": "json",
  "translator": "yaml",
  "output": "a: 1\\n",
  "warning": "optional, only when the converter had a non-fatal note"
}`

const TEXT_EXAMPLES = [
	{
		label: 'Raw text POST',
		code: `curl -X POST ${SITE_URL}/api/text/camel-case \\
  -H 'accept: text/plain' \\
  -d 'hello world'
# => helloWorld`
	},
	{
		label: 'GET',
		code: `curl '${SITE_URL}/api/encoding/base64-encode?input=hello&format=text'
# => aGVsbG8=`
	}
]

const ERROR_RESPONSE = `{
  "error": "Unknown converter \\"json/foo\\". See /api for the list.",
  "tool": "json",
  "translator": "foo"
}`

const MCP_CLIENTS = [
	{
		label: 'Claude Code',
		code: `claude mcp add --transport http transcode ${SITE_URL}/mcp`
	},
	{
		label: 'Claude Desktop',
		code: `// claude_desktop_config.json (uses the mcp-remote bridge)
{
  "mcpServers": {
    "transcode": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${SITE_URL}/mcp"]
    }
  }
}`
	},
	{
		label: 'Cursor',
		code: `// .cursor/mcp.json
{
  "mcpServers": {
    "transcode": { "url": "${SITE_URL}/mcp" }
  }
}`
	},
	{
		label: 'VS Code',
		code: `// .vscode/mcp.json
{
  "servers": {
    "transcode": { "type": "http", "url": "${SITE_URL}/mcp" }
  }
}`
	}
]

const MCP_CALLS = [
	{
		label: 'list_converters',
		code: `{
  "name": "list_converters",
  "arguments": { "tool": "json", "query": "yaml" }
}`
	},
	{
		label: 'convert',
		code: `{
  "name": "convert",
  "arguments": {
    "tool": "text",
    "translator": "camel-case",
    "input": "hello world"
  }
}`
	}
]

const AGENT_PROMPT = `You can convert, format and encode text with the Transcode API at ${SITE_URL}.
- Discover converters: GET ${SITE_URL}/api (or the list_converters MCP tool).
- Convert: POST ${SITE_URL}/api/{tool}/{translator} with {"input": "..."}.
- Add ?format=text to get only the converted text.
- Inputs are limited to 100 KB. A 422 means the input is invalid for that converter; read the "error" field.
- Rate limit: 60 requests/minute per IP; on 429, back off and retry.
Full guide: ${SITE_URL}/LLM.md`

// --- Page -------------------------------------------------------------------

function Docs() {
	const active = useActiveSection()
	const [filter, setFilter] = useState('')

	const filtered = useMemo(() => {
		const q = filter.trim().toLowerCase()
		if (!q) return tools
		return tools
			.map(tool => ({
				...tool,
				translators: tool.translators.filter(t =>
					`${tool.slug} ${tool.label} ${t.slug} ${t.label}`
						.toLowerCase()
						.includes(q)
				)
			}))
			.filter(tool => tool.translators.length > 0)
	}, [filter])

	const total = tools.reduce((n, t) => n + t.translators.length, 0)

	return (
		<main className="flex-1">
			<div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[180px_minmax(0,1fr)]">
				<aside className="max-lg:hidden">
					<nav
						aria-label="On this page"
						className="sticky top-20 text-[13px]"
					>
						<p className="mb-2 text-[11px] font-medium tracking-wider text-subtle uppercase">
							On this page
						</p>
						<ul className="space-y-0.5 border-l border-line">
							{SECTIONS.map(([id, label]) => (
								<li key={id}>
									<a
										href={`#${id}`}
										className={`-ml-px block border-l py-1 pl-3 transition-colors ${
											active === id
												? 'border-accent text-fg'
												: 'border-transparent text-muted hover:text-fg'
										}`}
									>
										{label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</aside>

				<article className="min-w-0 text-[14px] leading-relaxed text-muted">
					<header className="pb-8">
						<h1 className="text-2xl font-semibold tracking-tight text-fg">
							API, MCP &amp; LLM docs
						</h1>
						<p className="mt-2 max-w-2xl text-[15px]">
							Use all {total} Transcode converters from scripts
							and AI agents. Free, no API key, nothing stored.
						</p>
						<ul className="mt-4 flex flex-wrap gap-2 text-[13px]">
							{[
								['HTTP API', '#api'],
								['MCP server', '#mcp'],
								['LLM.md', '/LLM.md']
							].map(([label, href]) => (
								<li key={href}>
									<a
										href={href}
										className="flex h-7 items-center rounded-md border border-line px-2.5 text-muted transition-colors hover:bg-elevated hover:text-fg"
									>
										{label}
									</a>
								</li>
							))}
						</ul>
					</header>

					<Section id="overview" title="Overview">
						<Table
							rows={[
								['Base URL', <C key="u">{SITE_URL}</C>],
								['Auth', 'None'],
								['Input limit', '100 KB'],
								['Rate limit', '60 requests / minute per IP'],
								['CORS', 'Open (any origin)'],
								[
									'Converter id',
									<span key="c">
										<C>{'{tool}/{translator}'}</C>, e.g.{' '}
										<C>json/yaml</C>
									</span>
								]
							]}
						/>
						<p>Quick start:</p>
						<CodeBlock snippets={API_EXAMPLES} />
					</Section>

					<Section id="api" title="HTTP API">
						<Table
							rows={[
								['GET /api', 'JSON index of every endpoint.'],
								[
									'POST /api/{tool}/{translator}',
									'Convert the request body.'
								],
								[
									'GET /api/{tool}/{translator}?input=…',
									'Convert a short input from the query string.'
								]
							]}
						/>

						<H3>Request</H3>
						<p>
							A <C>POST</C> with a JSON content type must be{' '}
							<C>{'{ "input": "<string>" }'}</C>. Any other
							content type is treated as raw text, with the whole
							body as the input.
						</p>

						<H3>Response</H3>
						<p>
							JSON by default. Add <C>?format=text</C> or send{' '}
							<C>Accept: text/plain</C> to get only the converted
							text.
						</p>
						<CodeBlock
							snippets={[{ label: 'JSON', code: RESPONSE }]}
						/>
						<Table
							rows={[
								[
									'tool',
									'string',
									'Tool slug that handled the request.'
								],
								['translator', 'string', 'Translator slug.'],
								['output', 'string', 'The converted text.'],
								[
									'warning',
									'string?',
									'Optional non-fatal note.'
								]
							]}
						/>

						<H3>Plain-text and GET variants</H3>
						<CodeBlock snippets={TEXT_EXAMPLES} />
					</Section>

					<Section id="errors" title="Errors">
						<p>
							Errors return JSON with an <C>error</C> message,
							plus <C>tool</C> and <C>translator</C> when known.
						</p>
						<CodeBlock
							snippets={[{ label: 'JSON', code: ERROR_RESPONSE }]}
						/>
						<Table rows={STATUS} />
					</Section>

					<Section id="mcp" title="MCP server">
						<p>
							A remote{' '}
							<a
								href="https://modelcontextprotocol.io"
								target="_blank"
								rel="noreferrer"
								className="text-accent hover:underline"
							>
								Model Context Protocol
							</a>{' '}
							server lets AI assistants run converters directly.
							It is stateless Streamable HTTP at{' '}
							<C>{`${SITE_URL}/mcp`}</C> with no authentication.
						</p>

						<H3>Connect a client</H3>
						<CodeBlock snippets={MCP_CLIENTS} />

						<H3>Tools</H3>
						<Table
							rows={[
								[
									'list_converters',
									<span key="l">
										List available converters. Optional{' '}
										<C>tool</C> (slug) and <C>query</C>{' '}
										(case-insensitive search).
									</span>
								],
								[
									'convert',
									<span key="c">
										Run a converter. Requires <C>tool</C>,{' '}
										<C>translator</C> and <C>input</C> (max
										100 KB). Failures set <C>isError</C>.
									</span>
								]
							]}
						/>
						<CodeBlock
							snippets={MCP_CALLS}
							title="Example tool calls"
						/>
					</Section>

					<Section id="llm" title="LLM usage">
						<p>
							<a
								href="/LLM.md"
								className="text-accent hover:underline"
							>
								/LLM.md
							</a>{' '}
							is a markdown guide generated from the converter
							registry: API usage, limits, status codes and every
							endpoint. Point an agent at it or paste it into a
							prompt. Pages also advertise it via{' '}
							<C>
								{'<link rel="alternate" type="text/markdown">'}
							</C>
							.
						</p>
						<H3>Drop-in system prompt</H3>
						<p>
							Add this to an agent that has HTTP access but no MCP
							support:
						</p>
						<CodeBlock
							snippets={[{ label: 'Prompt', code: AGENT_PROMPT }]}
						/>
						<H3>Tips</H3>
						<ul className="list-disc space-y-1 pl-5">
							<li>
								Discover converters instead of guessing slugs.
							</li>
							<li>
								Use <C>?format=text</C> when you only need the
								converted text.
							</li>
							<li>
								Treat <C>422</C> as "invalid input for this
								converter".
							</li>
						</ul>
					</Section>

					<Section id="faq" title="FAQ">
						<dl className="space-y-4">
							{FAQS.map(([q, a]) => (
								<div key={q}>
									<dt className="font-medium text-fg">{q}</dt>
									<dd className="mt-1">{a}</dd>
								</div>
							))}
						</dl>
					</Section>

					<Section id="converters" title="Converters">
						<input
							type="search"
							value={filter}
							onChange={e => setFilter(e.target.value)}
							placeholder={`Filter ${total} converters…`}
							aria-label="Filter converters"
							className="h-8 w-full rounded-md border border-line bg-surface px-2.5 text-[13px] text-fg outline-none placeholder:text-subtle focus:border-line-strong sm:w-72"
						/>
						<div className="space-y-4 pt-1">
							{filtered.map(tool => (
								<div key={tool.slug}>
									<h3 className="font-medium text-fg">
										{tool.label}
									</h3>
									<ul className="mt-1.5 flex flex-wrap gap-1.5">
										{tool.translators.map(t => (
											<li key={t.slug}>
												<a
													href={`/${tool.slug}/${t.slug}`}
													className="rounded border border-line px-1.5 py-0.5 font-mono text-[12px] transition-colors hover:bg-elevated hover:text-fg"
												>
													{tool.slug}/{t.slug}
												</a>
											</li>
										))}
									</ul>
								</div>
							))}
							{filtered.length === 0 && (
								<p>No converters match.</p>
							)}
						</div>
					</Section>
				</article>
			</div>
		</main>
	)
}
