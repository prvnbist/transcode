import React from 'react'

import {
	Form,
	FieldSet,
	Legend,
	TextArea,
	Error,
	Button,
	Title3
} from '../../styles/index'

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

const MorseToText = () => {
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
			<Title3>Morse To Text</Title3>
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
