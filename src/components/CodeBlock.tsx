import { IconCheck, IconCopy } from '@tabler/icons-react'
import { useState } from 'react'

export type Snippet = { label: string; code: string }

/** Code block with a copy button and optional tabs (e.g. curl / JS / Python). */
export default function CodeBlock({
	snippets,
	title
}: {
	snippets: Array<Snippet>
	title?: string
}) {
	const [active, setActive] = useState(0)
	const [copied, setCopied] = useState(false)
	const current = snippets[Math.min(active, snippets.length - 1)]

	async function copy() {
		try {
			await navigator.clipboard.writeText(current.code)
			setCopied(true)
			setTimeout(() => setCopied(false), 1500)
		} catch {
			// Clipboard unavailable (insecure context or denied): ignore
		}
	}

	const showHeader = title || snippets.length > 1

	return (
		<figure className="mt-3 min-w-0 overflow-hidden rounded-md border border-line bg-surface">
			<div className="flex h-9 items-center gap-1 border-b border-line bg-elevated px-2">
				{showHeader && snippets.length > 1 ? (
					<div role="tablist" className="flex gap-1">
						{snippets.map((s, i) => (
							<button
								key={s.label}
								type="button"
								role="tab"
								aria-selected={i === active}
								onClick={() => setActive(i)}
								className={`h-6 cursor-pointer rounded px-2 text-[12px] font-medium transition-colors ${
									i === active
										? 'bg-hover text-fg'
										: 'text-muted hover:text-fg'
								}`}
							>
								{s.label}
							</button>
						))}
					</div>
				) : (
					<span className="px-1 text-[12px] font-medium text-muted">
						{title ?? current.label}
					</span>
				)}
				<button
					type="button"
					onClick={copy}
					aria-label="Copy code"
					className="ml-auto flex h-6 cursor-pointer items-center gap-1 rounded px-1.5 text-[12px] text-muted transition-colors hover:bg-hover hover:text-fg"
				>
					{copied ? (
						<IconCheck className="size-3.5 text-accent" />
					) : (
						<IconCopy className="size-3.5" />
					)}
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>
			<pre className="overflow-auto p-3 font-mono text-[12px] leading-relaxed text-fg">
				{current.code}
			</pre>
		</figure>
	)
}
