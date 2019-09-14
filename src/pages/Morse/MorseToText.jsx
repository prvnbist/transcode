import React from 'react'

import {
	Form,
	FieldSet,
	Legend,
	TextArea,
	Error,
	Button
} from '../../styles/index'

const splitTowords = code => {
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

const MorseToText = ({ morse }) => {
	const [morseCode, setMorseCode] = React.useState('')
	const [errors, setError] = React.useState('')
	const translatedText = React.useRef(null)
	const onSubmit = e => {
		e.preventDefault()
		const words = splitTowords(morseCode)
		const binaryArray = convertWordsToBinaryArray(words)
		const binaryWords = joinBinaryWordArray(binaryArray)
		const parsedText = convertBinaryToText(binaryWords, morse)
		translatedText.current.value = parsedText
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

	return (
		<React.Fragment>
			<Form onSubmit={onSubmit} onKeyDown={e => shortcut(e)}>
				<FieldSet>
					<Legend>Morse</Legend>
					<TextArea
						name="text"
						id="text"
						placeholder="Use single space inbetween letters and / for space between words"
						value={morseCode}
						onChange={e =>
							setMorseCode(e.target.value) ||
							validate(e.target.value)
						}
					/>
				</FieldSet>
				{errors && <Error>{errors}</Error>}
				<div>
					<Button type="submit">Translate</Button>
				</div>
				<FieldSet>
					<Legend>Text</Legend>
					<TextArea
						style={{ fontWeight: 'bold' }}
						ref={translatedText}
						name="translatedText"
						id="translatedText"
						readOnly
					/>
				</FieldSet>
			</Form>
			<span>Pro Tip - Use Ctrl+Enter to convert the text.</span>
		</React.Fragment>
	)
}

export default MorseToText
