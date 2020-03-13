import React from 'react'
import Editor from '@monaco-editor/react'

import { Error, EditorWrapper } from '../../styles/index'
import { inputEditorOptions, outputEditorOptions } from '../../editor'

const morse = {
	a: [0, 1],
	b: [1, 0, 0, 0],
	c: [1, 0, 1, 0],
	d: [1, 0, 0],
	e: [0],
	f: [0, 0, 1, 0],
	g: [1, 1, 0],
	h: [0, 0, 0, 0],
	i: [0, 0],
	j: [0, 1, 1, 1],
	k: [1, 0, 1],
	l: [0, 1, 0, 0],
	m: [1, 1],
	n: [1, 0],
	o: [1, 1, 1],
	p: [0, 1, 1, 0],
	q: [1, 1, 0, 1],
	r: [0, 1, 0],
	s: [0, 0, 0],
	t: [1],
	u: [0, 0, 1],
	v: [0, 0, 0, 1],
	w: [0, 1, 1],
	x: [1, 0, 0, 1],
	y: [1, 0, 1, 1],
	z: [1, 1, 0, 0]
}

const TextToMorse = () => {
	const editorRef = React.useRef()
	const [input] = React.useState('')
	const [errors, setError] = React.useState('')
	const [output, setOutput] = React.useState('')

	function handleEditorDidMount(_, editor) {
		editorRef.current = editor
		listenEditorChagnes()
	}

	const validate = value => {
		const chars = value
			.replace(/\n/g, ' ')
			.match(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./@#]/g, '')
		if (chars && chars.length > 0) {
			return setError(
				`Invalid character${
					chars.length === 1 ? '' : 's'
				} will be omitted!: ${chars.join(' ')}`
			)
		}
		return setError('')
	}

	const transcode = value => {
		const arrayOfWords = value
			.replace(/\n/g, ' ')
			.replace(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./@#]/g, '')
			.split(' ')
			.map(word => word.toLowerCase())
			.filter(Boolean)
		let morseWord = []
		arrayOfWords.map(word => {
			let parsed = [...word.trim()]
				.filter(Boolean)
				.map(letter =>
					morse[letter].map(i => (i === 0 ? '.' : '-')).join('')
				)
			return morseWord.push(parsed.join(' '))
		})
		return morseWord.join(' / ')
	}

	function listenEditorChagnes() {
		editorRef.current.onDidChangeModelContent(ev => {
			validate(editorRef.current.getValue())
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
			{errors && <Error>{errors}</Error>}
		</EditorWrapper>
	)
}

export default TextToMorse
