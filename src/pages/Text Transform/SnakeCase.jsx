import React from 'react'
import Editor from '@monaco-editor/react'

import { EditorWrapper } from '../../styles/index'
import { inputEditorOptions, outputEditorOptions } from '../../editor'

const SnakeCase = () => {
	const editorRef = React.useRef()
	const [input] = React.useState('')
	const [output, setOutput] = React.useState('')

	function handleEditorDidMount(_, editor) {
		editorRef.current = editor
		listenEditorChagnes()
	}

	const transcode = input => {
		return input
			.replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
			.replace(/([a-z])([A-Z])/g, (m, a, b) => a + '_' + b.toLowerCase())
			.replace(/[^A-Za-z0-9]+|_+/g, '_')
			.toLowerCase()
	}

	function listenEditorChagnes() {
		editorRef.current.onDidChangeModelContent(ev => {
			const output = transcode(editorRef.current.getValue())
			setOutput(output)
		})
	}

	return (
		<EditorWrapper>
			<Editor
				value={input}
				language="text"
				theme={'solarized-dark'}
				options={inputEditorOptions}
				editorDidMount={handleEditorDidMount}
			/>
			<Editor
				value={output}
				language="text"
				theme={'solarized-dark'}
				options={outputEditorOptions}
			/>
		</EditorWrapper>
	)
}

export default SnakeCase
