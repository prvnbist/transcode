type Props = {
	value: string
	readOnly?: boolean
	onChange?: (value: string) => void
}

/**
 * Lightweight stand-in for Monaco. It is rendered on the server and while the
 * editor loads, so the page has real text and no layout shift.
 */
export default function PlainEditor({ value, readOnly, onChange }: Props) {
	return (
		<textarea
			value={value}
			readOnly={readOnly}
			spellCheck={false}
			aria-label={readOnly ? 'Output' : 'Input'}
			onChange={e => onChange?.(e.target.value)}
			className="block size-full resize-none bg-surface p-3 pl-14 font-mono text-[13px] leading-[21px] text-[#d4d6db] outline-none"
		/>
	)
}
