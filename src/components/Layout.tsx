import { IconAlertTriangle, IconCheck } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

import CodeEditor from '#/components/CodeEditor'
import Translators from '#/components/Translators'
import { getExample } from '#/examples'
import type { Tool, Translator } from '#/tools'

const languageLabels: Record<string, string> = {
	plaintext: 'Text',
	json: 'JSON',
	html: 'HTML',
	css: 'CSS',
	yaml: 'YAML',
	sql: 'SQL',
	pug: 'Pug',
	graphql: 'GraphQL',
	javascript: 'JavaScript',
	typescript: 'TypeScript'
}

const MAX_SHARE_LENGTH = 4000
const MAX_FILE_SIZE = 1_000_000
// Server functions: don't fire a request on every keystroke
const REMOTE = new Set(['html/pug', 'html/jsx'])

const extensions: Record<string, string> = {
	json: 'json',
	yaml: 'yaml',
	html: 'html',
	css: 'css',
	sql: 'sql',
	graphql: 'graphql',
	javascript: 'js',
	typescript: 'ts',
	pug: 'pug'
}

type PanelProps = {
	title: string
	language: string
	actions?: React.ReactNode
	children: React.ReactNode
	className?: string
}

function Panel({ title, language, actions, children, className }: PanelProps) {
	return (
		<div className={`flex min-h-0 flex-col bg-surface ${className ?? ''}`}>
			<div className="flex h-9 shrink-0 items-center gap-2 border-b border-line px-3">
				<span className="text-[12px] font-medium text-muted">
					{title}
				</span>
				<span className="rounded border border-line px-1.5 py-px font-mono text-[10.5px] text-subtle">
					{languageLabels[language] ?? language}
				</span>
				<div className="ml-auto flex items-center gap-1">{actions}</div>
			</div>
			<div className="relative min-h-0 flex-1">{children}</div>
		</div>
	)
}

function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type="button"
			{...props}
			className="flex h-6 cursor-pointer items-center gap-1.5 rounded-md px-2 text-[12px] text-muted transition-colors hover:bg-hover hover:text-fg disabled:pointer-events-none disabled:opacity-40"
		/>
	)
}

type Props = {
	tool: Tool
	translator: Translator
	/** Input from a shared link; falls back to the example. */
	initialInput?: string
}

export default function Layout({ tool, translator, initialInput }: Props) {
	const [input, setInput] = useState(
		() => initialInput ?? getExample(tool.slug, translator.slug)
	)
	const [output, setOutput] = useState('')
	const [warning, setWarning] = useState('')
	const [copied, setCopied] = useState(false)
	const [shared, setShared] = useState(false)
	const [auto, setAuto] = useState(false)
	const fileRef = useRef<HTMLInputElement>(null)
	const [isMac, setIsMac] = useState(true)

	const translate = async () => {
		setWarning(translator.validate?.(input) ?? '')
		setOutput((await translator.convert(input)) || '')
	}

	// Keep the latest translate() reachable from the global shortcut
	const translateRef = useRef(translate)
	translateRef.current = translate

	useEffect(() => {
		setIsMac(/Mac|iPhone|iPad/.test(navigator.platform))
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
				e.preventDefault()
				e.stopPropagation()
				translateRef.current()
			}
		}
		// Capture phase so Monaco doesn't swallow the shortcut
		window.addEventListener('keydown', onKeyDown, true)
		return () => window.removeEventListener('keydown', onKeyDown, true)
	}, [])

	const copy = async () => {
		await navigator.clipboard.writeText(output)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	const share = async () => {
		const url = new URL(window.location.href)
		url.search = ''
		url.searchParams.set('input', input)
		await navigator.clipboard.writeText(url.toString())
		setShared(true)
		setTimeout(() => setShared(false), 1500)
	}

	const outputExt = extensions[translator.outputLanguage ?? ''] ?? 'txt'

	const download = () => {
		const url = URL.createObjectURL(
			new Blob([output], { type: 'text/plain' })
		)
		const a = document.createElement('a')
		a.href = url
		a.download = `${tool.slug}-${translator.slug}.${outputExt}`
		a.click()
		URL.revokeObjectURL(url)
	}

	const openFile = async (file?: File) => {
		if (!file) return
		if (file.size > MAX_FILE_SIZE) {
			setWarning('That file is too large. The limit is 1 MB.')
			return
		}
		setInput(await file.text())
	}

	const isRemote = REMOTE.has(`${tool.slug}/${translator.slug}`)
	useEffect(() => {
		if (!auto || isRemote) return
		const id = setTimeout(() => translateRef.current(), 300)
		return () => clearTimeout(id)
	}, [auto, isRemote, input])

	const inputLanguage = translator.inputLanguage ?? tool.inputLanguage
	const outputLanguage = translator.outputLanguage ?? 'plaintext'

	return (
		<section className="flex min-h-0 flex-1 flex-col">
			<div className="flex h-11 shrink-0 items-center gap-3 border-b border-line bg-canvas px-3">
				<Translators tool={tool} active={translator.slug} />
				<button
					type="button"
					onClick={translate}
					className="flex h-7 shrink-0 cursor-pointer items-center gap-2 rounded-md bg-accent pr-1.5 pl-3 font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_1px_2px_rgb(0_0_0/0.4)] transition-colors hover:bg-accent-hover"
				>
					Translate
					<span className="flex h-[18px] items-center rounded bg-white/15 px-1 text-[11px] text-white/80 max-sm:hidden">
						{isMac ? '⌘' : 'Ctrl'} ↵
					</span>
				</button>
				{!isRemote && (
					<label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[12px] text-muted select-none max-sm:hidden">
						<input
							type="checkbox"
							checked={auto}
							onChange={e => setAuto(e.target.checked)}
							className="accent-accent"
						/>
						Auto
					</label>
				)}
			</div>

			<div className="grid min-h-0 flex-1 grid-rows-2 gap-px bg-line md:grid-cols-2 md:grid-rows-1">
				<Panel
					title="Input"
					language={inputLanguage}
					actions={
						<>
							<GhostButton
								onClick={share}
								disabled={
									!input || input.length > MAX_SHARE_LENGTH
								}
								title={
									input.length > MAX_SHARE_LENGTH
										? 'Input is too long to share as a link'
										: 'Copy a link that includes this input'
								}
							>
								{shared ? 'Link copied' : 'Share'}
							</GhostButton>
							<GhostButton
								onClick={() => fileRef.current?.click()}
							>
								Open
							</GhostButton>
							<GhostButton
								onClick={() => setInput('')}
								disabled={!input}
							>
								Clear
							</GhostButton>
						</>
					}
				>
					<div
						className="size-full"
						onDragOver={e => e.preventDefault()}
						onDrop={e => {
							e.preventDefault()
							openFile(e.dataTransfer.files[0])
						}}
					>
						<CodeEditor
							value={input}
							onChange={setInput}
							language={inputLanguage}
						/>
					</div>
					<input
						ref={fileRef}
						type="file"
						hidden
						onChange={e => {
							openFile(e.target.files?.[0])
							e.target.value = ''
						}}
					/>
				</Panel>
				<Panel
					title="Output"
					language={outputLanguage}
					actions={
						<>
							<GhostButton onClick={download} disabled={!output}>
								Download
							</GhostButton>
							<GhostButton onClick={copy} disabled={!output}>
								{copied ? (
									<>
										<IconCheck
											className="size-3.5 text-emerald-400"
											strokeWidth={2.5}
										/>
										Copied
									</>
								) : (
									'Copy'
								)}
							</GhostButton>
						</>
					}
				>
					{warning && (
						<div
							role="status"
							className="flex items-start gap-2 border-b border-warn/20 bg-warn/[0.06] px-3 py-2 text-[12px] text-warn"
						>
							<IconAlertTriangle className="mt-px size-3.5 shrink-0" />
							{warning}
						</div>
					)}
					<CodeEditor
						readOnly
						value={output}
						language={outputLanguage}
					/>
				</Panel>
			</div>
		</section>
	)
}
