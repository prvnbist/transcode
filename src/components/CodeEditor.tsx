import { Suspense, lazy, useEffect, useState } from 'react'

import PlainEditor from '#/components/PlainEditor'

// Monaco is large; keep it out of the initial bundle
const Editor = lazy(() => import('#/components/Editor'))

type Props = {
	value: string
	language: string
	readOnly?: boolean
	onChange?: (value: string) => void
}

export default function CodeEditor(props: Props) {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])

	const fallback = (
		<PlainEditor
			value={props.value}
			readOnly={props.readOnly}
			onChange={props.onChange}
		/>
	)

	// Server and first client render match: plain text, then upgrade
	if (!mounted) return fallback
	return (
		<Suspense fallback={fallback}>
			<Editor {...props} />
		</Suspense>
	)
}
