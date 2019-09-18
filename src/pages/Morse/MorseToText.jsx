import React from 'react'
import Editor, { monaco } from '@monaco-editor/react'

import { Error, EditorWrapper } from '../../styles/index'

const morse = {
	'01': 'a',
	'1000': 'b',
	'1010': 'c',
	'100': 'd',
	'0': 'e',
	'0010': 'f',
	'110': 'g',
	'0000': 'h',
	'00': 'i',
	'0111': 'j',
	'101': 'k',
	'0100': 'l',
	'11': 'm',
	'10': 'n',
	'111': 'o',
	'0110': 'p',
	'1101': 'q',
	'010': 'r',
	'000': 's',
	'1': 't',
	'001': 'u',
	'0001': 'v',
	'011': 'w',
	'1001': 'x',
	'1011': 'y',
	'1100': 'z'
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

const splitToWords = code => {
	return code
		.replace(/\n/g, ' ')
		.split('/')
		.map(word => word.split(' ').filter(Boolean))
}

const convertWordsToBinaryArray = words => {
	return words.map(word => {
		return word.map(letter =>
			letter.split('').map(code => (code === '-' ? 1 : 0))
		)
	})
}

const joinBinaryWordArray = binary => {
	return binary.map(word => word.map(letter => letter.join('')))
}

const convertBinaryToText = (binaryWords, morse) => {
	return binaryWords
		.map(word => word.map(letter => morse[letter]).join(''))
		.join(' ')
}

const MorseToText = () => {
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
			.match(/[!$%^&*()_+|~=`{}[\]:";'<>?,@#0-9a-z]/gi)
		if (chars && chars.length > 0) {
			return setError(
				`Invalid character${
					chars.length === 1 ? '' : 's'
				} will be omitted!: ${chars.join(' ')}`
			)
		}
		return setError('')
	}

	function listenEditorChagnes() {
		editorRef.current.onDidChangeModelContent(ev => {
			validate(editorRef.current.getValue())
			const words = splitToWords(editorRef.current.getValue())
			const binaryArray = convertWordsToBinaryArray(words)
			const binaryWords = joinBinaryWordArray(binaryArray)
			const parsedText = convertBinaryToText(binaryWords, morse)
			setOutput(parsedText)
		})
	}

	const inputEditorOptions = {
		fontSize: 16,
		minimap: {
			enabled: false
		},
		wordWrap: 'bounded'
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

export default MorseToText
