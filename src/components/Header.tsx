import {
	IconArrowsExchange,
	IconBrandGithub,
	IconSearch
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Link, useParams, useRouterState } from '@tanstack/react-router'

import Menu from '#/components/Menu'
import { findTranslator } from '#/tools'

function LogoMark() {
	return (
		<span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-b from-accent-hover to-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
			<IconArrowsExchange
				className="size-3.5"
				color="white"
				strokeWidth={2.5}
			/>
		</span>
	)
}

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isMac, setIsMac] = useState(true)
	const pathname = useRouterState({ select: s => s.location.pathname })
	const params = useParams({ strict: false })
	const found =
		params.tool && params.translator
			? findTranslator(params.tool, params.translator)
			: null

	useEffect(() => setIsMenuOpen(false), [pathname])

	useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), [])

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				setIsMenuOpen(open => !open)
			}
		}
		window.addEventListener('keydown', onKeyDown, true)
		return () => window.removeEventListener('keydown', onKeyDown, true)
	}, [])

	return (
		<header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-3 border-b border-line bg-canvas px-3">
			<Link
				to="/"
				className="flex items-center gap-2 rounded-md py-1 pr-1.5 font-semibold tracking-tight"
			>
				<LogoMark />
				<span>Transcode</span>
			</Link>

			{found && (
				<nav
					aria-label="Breadcrumb"
					className="flex min-w-0 items-center gap-1.5 max-sm:hidden"
				>
					<span className="text-subtle">/</span>
					<button
						type="button"
						onClick={() => setIsMenuOpen(true)}
						className="cursor-pointer truncate rounded px-1 text-muted hover:text-fg"
					>
						{found.tool.label}
					</button>
					<span className="text-subtle">/</span>
					<span className="truncate px-1 font-medium">
						{found.translator.label}
					</span>
				</nav>
			)}

			<div className="ml-auto flex items-center gap-2">
				<button
					type="button"
					aria-label="Search tools"
					onClick={() => setIsMenuOpen(true)}
					className="flex h-8 cursor-pointer items-center gap-2 rounded-md border border-line bg-surface pr-1.5 pl-2.5 text-muted transition-colors hover:border-line-strong hover:text-fg sm:w-60"
				>
					<IconSearch className="size-3.5 shrink-0" />
					<span className="max-sm:hidden">Search tools…</span>
					<span className="ml-auto flex gap-0.5 max-sm:hidden">
						<kbd className="kbd">{isMac ? '⌘' : 'Ctrl'}</kbd>
						<kbd className="kbd">K</kbd>
					</span>
				</button>
				<Link
					to="/docs"
					className="flex h-8 items-center rounded-md px-2 text-muted transition-colors hover:bg-hover hover:text-fg"
				>
					Docs
				</Link>
				<a
					href="https://github.com/prvnbist/transcode"
					target="_blank"
					rel="noreferrer"
					aria-label="GitHub repository"
					title="GitHub"
					className="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-hover hover:text-fg"
				>
					<IconBrandGithub className="size-4" />
				</a>
			</div>

			<Menu open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
		</header>
	)
}
