import React from 'react'

import {
	Form,
	FieldSet,
	Legend,
	TextArea,
	Tip,
	Error,
	Button
} from '../../styles/index'

const TextToMorse = ({ morse }) => {
	const [text, setText] = React.useState('')
	const [errors, setError] = React.useState('')
	const morseText = React.useRef(null)
	const onSubmit = e => {
		e.preventDefault()
		const arrayOfWords = text
			.replace(/\n/g, ' ')
			.replace(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./@#]/g, '')
			.split(' ')
			.map(word => word.toLowerCase())
			.filter(Boolean)
		let morseWord = []
		arrayOfWords.map(word => {
			let parsed = [...word].map(letter =>
				morse[letter].map(i => (i === 0 ? '.' : '-')).join('')
			)
			return morseWord.push(parsed.join(' '))
		})
		morseText.current.value = morseWord.join(' / ')
	}

	const keySequence = ['Control', 'Enter']
	let userInput = new Array(keySequence.length)
	const shortcut = e => {
		userInput = [...userInput.slice(1), e.key]
		if (keySequence.every((v, k) => v === userInput[k])) {
			onSubmit(e)
		}
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

	return (
		<React.Fragment>
			<Form onSubmit={onSubmit} onKeyDown={e => shortcut(e)}>
				<FieldSet>
					<Legend>Text</Legend>
					<TextArea
						name="text"
						id="text"
						value={text}
						placeholder="Enter your text"
						onChange={e =>
							setText(e.target.value) || validate(e.target.value)
						}
					/>
				</FieldSet>
				{errors && <Error>{errors}</Error>}
				<Button type="submit">Translate</Button>
				<Tip>/ - Word Separator</Tip>
				<FieldSet>
					<Legend>Morse</Legend>
					<TextArea
						ref={morseText}
						name="morseText"
						id="morseText"
						readOnly
					/>
				</FieldSet>
			</Form>
			<span>Pro Tip - Use Ctrl+Enter to convert the text.</span>
		</React.Fragment>
	)
}

export default TextToMorse
