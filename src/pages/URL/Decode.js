import React from 'react'
import Editor from '@monaco-editor/react'

import { EditorWrapper } from '../../styles/index'
import { inputEditorOptions, outputEditorOptions } from '../../editor'

const Decode = () => {
	const editorRef = React.useRef()
	const [input] = React.useState('')
	const [output, setOutput] = React.useState('')

	function handleEditorDidMount(_, editor) {
		editorRef.current = editor
		listenEditorChagnes()
	}

	function listenEditorChagnes() {
		editorRef.current.onDidChangeModelContent(ev => {
			const output = decodeURIComponent(editorRef.current.getValue())
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

export default Decode
