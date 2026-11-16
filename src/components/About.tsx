import { Link } from '@tanstack/react-router'

import { content, relatedTools } from '#/content'
import { toolName } from '#/seo'
import type { Tool, Translator } from '#/tools'

type Props = {
	tool: Tool
	translator: Translator
	example: string
	exampleOutput: string
}

function Code({ title, children }: { title: string; children: string }) {
	return (
		<figure className="min-w-0">
			<figcaption className="mb-1.5 text-[12px] font-medium text-muted">
				{title}
			</figcaption>
			<pre className="max-h-64 overflow-auto rounded-md border border-line bg-surface p-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-fg">
				{children}
			</pre>
		</figure>
	)
}

export default function About({
	tool,
	translator,
	example,
	exampleOutput
}: Props) {
	const name = toolName(tool, translator)
	const info = content[tool.slug]
	const related = relatedTools(tool, translator)

	return (
		<article className="mx-auto w-full max-w-4xl px-4 py-10 text-[14px] leading-relaxed text-muted">
			<h1 className="text-xl font-semibold tracking-tight text-fg">
				{name}
			</h1>
			{info && <p className="mt-2">{info.intro}</p>}
			<p className="mt-2">
				Paste your input on the left and press Translate (or Ctrl/Cmd +
				Enter) to get the result on the right. Free, no sign-up.
			</p>

			{example && (
				<section className="mt-8">
					<h2 className="mb-3 text-[15px] font-semibold text-fg">
						Example
					</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<Code title="Input">{example}</Code>
						{exampleOutput && (
							<Code title="Output">{exampleOutput}</Code>
						)}
					</div>
				</section>
			)}

			{info && info.faqs.length > 0 && (
				<section className="mt-8">
					<h2 className="mb-3 text-[15px] font-semibold text-fg">
						Frequently asked questions
					</h2>
					<dl className="space-y-4">
						{info.faqs.map(faq => (
							<div key={faq.q}>
								<dt className="font-medium text-fg">{faq.q}</dt>
								<dd className="mt-1">{faq.a}</dd>
							</div>
						))}
					</dl>
				</section>
			)}

			{related.length > 0 && (
				<nav aria-label="Related tools" className="mt-8">
					<h2 className="mb-3 text-[15px] font-semibold text-fg">
						Related tools
					</h2>
					<ul className="flex flex-wrap gap-2">
						{related.map(r => (
							<li key={`${r.tool.slug}/${r.translator.slug}`}>
								<Link
									to="/$tool/$translator"
									params={{
										tool: r.tool.slug,
										translator: r.translator.slug
									}}
									className="flex h-7 items-center rounded-md border border-line px-2.5 text-[13px] text-muted transition-colors hover:bg-elevated hover:text-fg"
								>
									{toolName(r.tool, r.translator)}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			)}
		</article>
	)
}
