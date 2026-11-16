import { IconDots } from '@tabler/icons-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'

import type { Tool } from '#/tools'

type Props = { tool: Tool; active: string }

// Matches `gap-0.5` and the `size-8` more button
const GAP = 2
const MORE_WIDTH = 32

const linkClass = (isActive: boolean) =>
	`flex h-7 shrink-0 items-center rounded-md px-2.5 whitespace-nowrap transition-colors ${
		isActive
			? 'bg-hover font-medium text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)]'
			: 'text-muted hover:bg-elevated hover:text-fg'
	}`

export default function Translators({ tool, active }: Props) {
	const { translators } = tool
	const containerRef = useRef<HTMLDivElement>(null)
	const measureRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	// null until measured: show everything, clipped, so there is no flash
	const [visible, setVisible] = useState<Set<string> | null>(null)
	const [open, setOpen] = useState(false)

	useLayoutEffect(() => {
		const container = containerRef.current
		const measure = measureRef.current
		if (!container || !measure) return

		const compute = () => {
			const widths = Array.from(measure.children).map(
				child => (child as HTMLElement).offsetWidth
			)
			const available = container.clientWidth
			const activeIndex = translators.findIndex(t => t.slug === active)

			// Largest prefix that fits; the active item is always kept visible
			for (let n = translators.length; n >= 0; n--) {
				const shown = new Set(Array.from({ length: n }, (_, i) => i))
				if (activeIndex >= 0) shown.add(activeIndex)
				const width =
					[...shown].reduce((sum, i) => sum + widths[i], 0) +
					GAP * Math.max(shown.size - 1, 0) +
					(shown.size < translators.length ? MORE_WIDTH + GAP : 0)
				if (width <= available || n === 0) {
					setVisible(
						new Set([...shown].map(i => translators[i].slug))
					)
					return
				}
			}
		}

		compute()
		const observer = new ResizeObserver(compute)
		observer.observe(container)
		return () => observer.disconnect()
	}, [translators, active])

	useEffect(() => setOpen(false), [active, tool.slug])

	useEffect(() => {
		if (!open) return
		const onPointerDown = (e: PointerEvent) => {
			if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
		}
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false)
		}
		document.addEventListener('pointerdown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('pointerdown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [open])

	const shown = translators.filter(t => !visible || visible.has(t.slug))
	const hidden = translators.filter(t => visible && !visible.has(t.slug))

	const item = (t: (typeof translators)[number], className: string) => (
		<Link
			key={t.slug}
			to="/$tool/$translator"
			params={{ tool: tool.slug, translator: t.slug }}
			aria-current={active === t.slug ? 'page' : undefined}
			className={className}
		>
			{t.label}
		</Link>
	)

	return (
		<div
			ref={containerRef}
			className="relative flex min-w-0 flex-1 items-center gap-0.5"
		>
			<nav
				aria-label={`${tool.label} translators`}
				className="flex min-w-0 items-center gap-0.5 overflow-hidden"
			>
				{shown.map(t => item(t, linkClass(active === t.slug)))}
			</nav>
			{/* Outside the nav so its overflow-hidden doesn't clip the menu */}
			{hidden.length > 0 && (
				<div ref={menuRef} className="relative shrink-0">
					<button
						type="button"
						aria-label={`More ${tool.label} translators`}
						aria-haspopup="menu"
						aria-expanded={open}
						onClick={() => setOpen(o => !o)}
						className={`flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors ${
							open
								? 'bg-hover text-fg'
								: 'text-muted hover:bg-elevated hover:text-fg'
						}`}
					>
						<IconDots className="size-4" />
					</button>
					{open && (
						<div
							role="menu"
							className="absolute top-full left-0 z-30 mt-1 flex max-h-80 min-w-44 flex-col overflow-y-auto rounded-lg border border-line-strong bg-elevated p-1 shadow-xl shadow-black/50"
						>
							{hidden.map(t =>
								item(
									t,
									'flex h-8 items-center rounded-md px-2.5 whitespace-nowrap text-muted transition-colors hover:bg-hover hover:text-fg'
								)
							)}
						</div>
					)}
				</div>
			)}
			{/* Off-screen copy used to measure every item's natural width */}
			<div
				ref={measureRef}
				aria-hidden
				className="pointer-events-none invisible absolute top-0 left-0 flex h-0 gap-0.5 overflow-hidden"
			>
				{translators.map(t => (
					<span key={t.slug} className={linkClass(active === t.slug)}>
						{t.label}
					</span>
				))}
			</div>
		</div>
	)
}
