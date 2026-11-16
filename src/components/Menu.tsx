import { IconSearch } from '@tabler/icons-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'

import { tools } from '#/tools'

type Item = {
	tool: string
	toolLabel: string
	translator: string
	label: string
}

const allItems: Array<Item> = tools.flatMap(tool =>
	tool.translators.map(t => ({
		tool: tool.slug,
		toolLabel: tool.label,
		translator: t.slug,
		label: t.label
	}))
)

const matches = (item: Item, query: string) => {
	const haystack = `${item.toolLabel} ${item.label}`.toLowerCase()
	return query
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.every(word => haystack.includes(word))
}

type Props = { open: boolean; onClose: () => void }

export default function Menu({ open, onClose }: Props) {
	const navigate = useNavigate()
	const pathname = useRouterState({ select: s => s.location.pathname })
	const [query, setQuery] = useState('')
	const [active, setActive] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)
	const listRef = useRef<HTMLDivElement>(null)

	const items = useMemo(
		() => allItems.filter(item => matches(item, query)),
		[query]
	)

	const groups = useMemo(() => {
		const map = new Map<string, Array<Item & { index: number }>>()
		items.forEach((item, index) => {
			const group = map.get(item.toolLabel) ?? []
			group.push({ ...item, index })
			map.set(item.toolLabel, group)
		})
		return [...map.entries()]
	}, [items])

	useEffect(() => {
		if (!open) return
		setQuery('')
		const current = allItems.findIndex(
			i => `/${i.tool}/${i.translator}` === pathname
		)
		setActive(Math.max(current, 0))
		inputRef.current?.focus()
	}, [open])

	useEffect(() => {
		listRef.current
			?.querySelector(`[data-index="${active}"]`)
			?.scrollIntoView({ block: 'nearest' })
	}, [active, open])

	if (!open) return null

	const select = (item: Item | undefined) => {
		if (!item) return
		navigate({
			to: '/$tool/$translator',
			params: { tool: item.tool, translator: item.translator }
		})
		onClose()
	}

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setActive(i => (items.length ? (i + 1) % items.length : 0))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setActive(i =>
				items.length ? (i - 1 + items.length) % items.length : 0
			)
		} else if (e.key === 'Enter') {
			e.preventDefault()
			select(items[active])
		} else if (e.key === 'Escape') {
			e.preventDefault()
			onClose()
		}
	}

	return (
		<div
			className="fixed inset-0 z-20 flex items-start justify-center bg-black/60 px-4 pt-[14vh]"
			onMouseDown={e => e.target === e.currentTarget && onClose()}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Tools"
				onKeyDown={onKeyDown}
				className="flex max-h-[min(70vh,520px)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-line-strong bg-elevated shadow-[0_24px_64px_-12px_rgb(0_0_0/0.8)]"
			>
				<div className="flex items-center gap-2 border-b border-line px-4">
					<IconSearch className="size-4 shrink-0 text-subtle" />
					<input
						ref={inputRef}
						value={query}
						onChange={e => {
							setQuery(e.target.value)
							setActive(0)
						}}
						placeholder="Search tools…"
						aria-label="Search tools"
						className="h-12 w-full bg-transparent text-[14px] outline-none placeholder:text-subtle"
					/>
					<kbd className="kbd">Esc</kbd>
				</div>
				<div ref={listRef} className="overflow-y-auto p-2">
					{groups.length === 0 && (
						<p className="px-3 py-10 text-center text-muted">
							No tools match “{query}”
						</p>
					)}
					{groups.map(([label, group]) => (
						<div key={label} className="mb-2 last:mb-0">
							<p className="px-2.5 pt-2 pb-1 text-[11px] font-medium text-subtle">
								{label}
							</p>
							{group.map(item => {
								const isActive = item.index === active
								const isCurrent =
									`/${item.tool}/${item.translator}` ===
									pathname
								return (
									<button
										type="button"
										key={`${item.tool}/${item.translator}`}
										data-index={item.index}
										onMouseMove={() =>
											setActive(item.index)
										}
										onClick={() => select(item)}
										className={`flex h-8 w-full cursor-pointer items-center justify-between rounded-md px-2.5 text-left ${
											isActive
												? 'bg-hover text-fg'
												: 'text-muted'
										}`}
									>
										<span>{item.label}</span>
										{isCurrent && (
											<span className="text-[11px] text-subtle">
												Current
											</span>
										)}
									</button>
								)
							})}
						</div>
					))}
				</div>
				<div className="flex items-center gap-4 border-t border-line bg-surface px-4 py-2 text-[11px] text-subtle">
					<span className="flex items-center gap-1.5">
						<kbd className="kbd">↑</kbd>
						<kbd className="kbd">↓</kbd>Navigate
					</span>
					<span className="flex items-center gap-1.5">
						<kbd className="kbd">↵</kbd>Open
					</span>
					<span className="flex items-center gap-1.5">
						<kbd className="kbd">esc</kbd>Close
					</span>
				</div>
			</div>
		</div>
	)
}
