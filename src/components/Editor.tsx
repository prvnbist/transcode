import { Editor as MonacoEditor, type BeforeMount } from '@monaco-editor/react'

import PlainEditor from '#/components/PlainEditor'

const THEME = 'transcode'

const beforeMount: BeforeMount = monaco => {
	monaco.editor.defineTheme(THEME, {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '5c6068', fontStyle: 'italic' },
			{ token: 'string', foreground: '9ece6a' },
			{ token: 'string.key.json', foreground: 'a5b4fc' },
			{ token: 'string.value.json', foreground: '9ece6a' },
			{ token: 'number', foreground: 'f0a35e' },
			{ token: 'keyword', foreground: 'c4a7e7' },
			{ token: 'tag', foreground: 'a5b4fc' },
			{ token: 'attribute.name', foreground: 'f0c674' },
			{ token: 'delimiter', foreground: '8a8f98' }
		],
		colors: {
			'editor.background': '#0e0f11',
			'editor.foreground': '#d4d6db',
			'editor.lineHighlightBackground': '#ffffff06',
			'editor.lineHighlightBorder': '#00000000',
			'editor.selectionBackground': '#5e6ad24d',
			'editor.inactiveSelectionBackground': '#5e6ad226',
			'editorCursor.foreground': '#8b93f0',
			'editorLineNumber.foreground': '#34363c',
			'editorLineNumber.activeForeground': '#8a8f98',
			'editorIndentGuide.background1': '#ffffff08',
			'editorIndentGuide.activeBackground1': '#ffffff14',
			'editorWidget.background': '#16171a',
			'editorWidget.border': '#2b2c31',
			'editorSuggestWidget.background': '#16171a',
			'editorSuggestWidget.border': '#2b2c31',
			'editorSuggestWidget.selectedBackground': '#1c1d21',
			'scrollbar.shadow': '#00000000',
			'scrollbarSlider.background': '#ffffff0f',
			'scrollbarSlider.hoverBackground': '#ffffff1a',
			'scrollbarSlider.activeBackground': '#ffffff26'
		}
	})
}

const options = {
	fontSize: 13,
	lineHeight: 21,
	fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
	fontLigatures: true,
	padding: { top: 12, bottom: 12 },
	minimap: { enabled: false },
	scrollBeyondLastLine: false,
	overviewRulerLanes: 0,
	hideCursorInOverviewRuler: true,
	overviewRulerBorder: false,
	renderLineHighlight: 'line' as const,
	lineNumbersMinChars: 3,
	lineDecorationsWidth: 12,
	folding: false,
	guides: { indentation: true },
	scrollbar: {
		alwaysConsumeMouseWheel: false,
		verticalScrollbarSize: 8,
		horizontalScrollbarSize: 8,
		useShadows: false
	},
	automaticLayout: true
}

type Props = {
	value: string
	language: string
	readOnly?: boolean
	onChange?: (value: string) => void
}

export default function Editor({ value, language, readOnly, onChange }: Props) {
	return (
		<MonacoEditor
			value={value}
			theme={THEME}
			height="100%"
			language={language}
			beforeMount={beforeMount}
			loading={
				<PlainEditor
					value={value}
					readOnly={readOnly}
					onChange={onChange}
				/>
			}
			options={{ ...options, readOnly, domReadOnly: readOnly }}
			onChange={val => onChange?.(val ?? '')}
		/>
	)
}
