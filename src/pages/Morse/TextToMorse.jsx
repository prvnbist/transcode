import React from 'react'
import Editor, { monaco } from '@monaco-editor/react'

import { Error, EditorWrapper } from '../../styles/index'

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

	const translate = value => {
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
			const output = translate(editorRef.current.getValue())
			setOutput(output)
		})
	}

	const inputEditorOptions = {
		fontSize: 16,
		minimap: {
			enabled: false
		},
		wordWrap: 'on'
	}
	const outputEditorOptions = {
		...inputEditorOptions,
		readOnly: true
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
