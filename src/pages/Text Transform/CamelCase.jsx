import React from 'react'
import Editor, { monaco } from '@monaco-editor/react'

import { EditorWrapper } from '../../styles/index'
import { inputEditorOptions, outputEditorOptions } from '../../editor'

monaco
	.init()
	.then(monaco => {
		fetch('/solarized-dark.json')
			.then(res => res.json())
			.then(data => {
				monaco.editor.defineTheme('solarized-dark', data)
				monaco.editor.setTheme('solarized-dark')
			})
	})
	.catch(error =>
		console.error(
			'An error occurred during initialization of Monaco: ',
			error
		)
	)

const Encode = () => {
	const editorRef = React.useRef()
	const [input] = React.useState('')
	const [output, setOutput] = React.useState('')

	function handleEditorDidMount(_, editor) {
		editorRef.current = editor
		listenEditorChagnes()
	}

	const transcode = input => {
		const words = input.split(' ').filter(word => word.match(/[a-zA-Z0-9]/))
		const toLowOrUp = (value, type) => {
			if (type === 'low') {
				return value
					.split('')
					.filter(letter => letter.match(/[a-zA-Z0-9]/))
					.map((letter, index) =>
						index === 0 ? letter.toLowerCase() : letter
					)
					.join('')
			}
			return value
				.split('')
				.filter(letter => letter.match(/[a-zA-Z0-9]/))
				.map((letter, index) =>
					index === 0 ? letter.toUpperCase() : letter
				)
				.join('')
		}
		if (words.length === 1) {
			return toLowOrUp(words[0], 'low')
		}
		return words
			.map((word, index) => {
				if (index === 0) {
					return toLowOrUp(word, 'low')
				}
				return toLowOrUp(word, 'up')
			})
			.join('')
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

export default Encode
