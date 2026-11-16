import {
	IconBolt,
	IconCode,
	IconLink,
	IconShieldCheck
} from '@tabler/icons-react'
import { Link, createFileRoute } from '@tanstack/react-router'

import { tools } from '#/tools'

export const Route = createFileRoute('/')({
	component: Home
})

const translatorCount = tools.reduce((n, t) => n + t.translators.length, 0)

const features = [
	{
		title: 'Private by default',
		body: 'Nearly every conversion runs in your browser, and your input is never stored.',
		icon: IconShieldCheck
	},
	{
		title: 'Instant',
		body: 'No page loads, no sign-up. Press ⌘ Enter, or turn on Auto to convert as you type.',
		icon: IconBolt
	},
	{
		title: 'Shareable',
		body: 'Copy a link that carries your input, drop in a file, or download the result.',
		icon: IconLink
	},
	{
		title: 'API and LLM friendly',
		body: 'Every converter is available over a simple HTTP API, with an LLM.md index for agents.',
		icon: IconCode
	}
]

function Home() {
	const first = tools[0]
	return (
		<main className="flex-1">
			{/* Hero */}
			<section className="relative overflow-hidden border-b border-line">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(94_106_210/0.18),transparent)]"
				/>
				<div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
					<span className="mb-6 rounded-full border border-line-strong bg-surface px-3 py-1 text-[12px] text-muted">
						{tools.length} tools · {translatorCount} converters ·
						free
					</span>
					<h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
						Convert anything.
						<br />
						<span className="text-muted">Instantly.</span>
					</h1>
					<p className="mt-5 max-w-xl text-[15px] leading-relaxed text-pretty text-muted">
						Developer tools to convert, format and encode text,
						JSON, YAML, CSS, SQL, colors, hashes, timestamps and
						more. No sign-up, no tracking of your input.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<Link
							to="/$tool/$translator"
							params={{
								tool: first.slug,
								translator: first.translators[0].slug
							}}
							className="flex h-9 items-center rounded-md bg-accent px-4 font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_1px_2px_rgb(0_0_0/0.4)] transition-colors hover:bg-accent-hover"
						>
							Start converting
						</Link>
						<a
							href="https://github.com/prvnbist/transcode"
							target="_blank"
							rel="noreferrer"
							className="flex h-9 items-center rounded-md border border-line-strong bg-surface px-4 text-muted transition-colors hover:text-fg"
						>
							View on GitHub
						</a>
					</div>
					<p className="mt-4 text-[12px] text-subtle">
						Tip: press <kbd className="kbd">⌘</kbd>{' '}
						<kbd className="kbd">K</kbd> anywhere to search every
						tool.
					</p>
				</div>
			</section>

			{/* Tools */}
			<section className="mx-auto max-w-6xl px-4 py-16">
				<h2 className="text-xl font-semibold tracking-tight">
					Pick a tool
				</h2>
				<p className="mt-1 text-muted">
					Each tool has several converters, all one click apart.
				</p>
				<div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
					{tools.map(tool => (
						<Link
							key={tool.slug}
							to="/$tool/$translator"
							params={{
								tool: tool.slug,
								translator: tool.translators[0].slug
							}}
							className="group flex flex-col gap-3 bg-surface p-4 transition-colors hover:bg-elevated"
						>
							<div className="flex items-center justify-between">
								<span className="font-medium">
									{tool.label}
								</span>
								<span className="text-[12px] text-subtle">
									{tool.translators.length}
								</span>
							</div>
							<div className="flex flex-wrap gap-1.5">
								{tool.translators.slice(0, 4).map(t => (
									<span
										key={t.slug}
										className="rounded border border-line px-1.5 py-px text-[11.5px] text-muted"
									>
										{t.label}
									</span>
								))}
								{tool.translators.length > 4 && (
									<span className="px-1 py-px text-[11.5px] text-subtle">
										+{tool.translators.length - 4} more
									</span>
								)}
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* Features */}
			<section className="border-t border-line bg-surface">
				<div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
					{features.map(f => (
						<div key={f.title}>
							<span className="flex size-8 items-center justify-center rounded-md border border-line-strong bg-elevated text-accent-hover">
								<f.icon className="size-4" />
							</span>
							<h3 className="mt-4 font-medium">{f.title}</h3>
							<p className="mt-1.5 leading-relaxed text-muted">
								{f.body}
							</p>
						</div>
					))}
				</div>
			</section>

			<footer className="border-t border-line">
				<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-[12px] text-subtle">
					<span>© {new Date().getFullYear()} Transcode</span>
					<span className="flex gap-4">
						<a href="/LLM.md" className="hover:text-fg">
							LLM.md
						</a>
						<a href="/sitemap.xml" className="hover:text-fg">
							Sitemap
						</a>
						<a
							href="https://github.com/prvnbist/transcode"
							target="_blank"
							rel="noreferrer"
							className="hover:text-fg"
						>
							GitHub
						</a>
					</span>
				</div>
			</footer>
		</main>
	)
}
