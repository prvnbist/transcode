import React from 'react'

const splitTowords = code => {
	return code.split('/').map(word => word.split(' ').filter(Boolean))
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
	const translatedText = React.useRef(null)
	const onSubmit = e => {
		e.preventDefault()
		const words = splitTowords(morseCode)
		const binaryArray = convertWordsToBinaryArray(words)
		const binaryWords = joinBinaryWordArray(binaryArray)
		const parsedText = convertBinaryToText(binaryWords, morse)
		translatedText.current.value = parsedText
	}
	return (
		<React.Fragment>
			<form
				onSubmit={onSubmit}
				onKeyDown={e => {
					return e.keyCode === 13 ? onSubmit(e) : null
				}}>
				<fieldset>
					<legend>Enter the morse code</legend>
					<textarea
						name="text"
						id="text"
						placeholder="Use single space inbetween letters and / for space between words"
						value={morseCode}
						onChange={e => setMorseCode(e.target.value)}
					/>
				</fieldset>
				<div>
					<button type="submit">Translate</button>
				</div>
				<fieldset>
					<legend>Output Text</legend>
					<textarea
						style={{ fontWeight: 'bold' }}
						ref={translatedText}
						name="translatedText"
						id="translatedText"
						readOnly
					/>
				</fieldset>
			</form>
			<span>Pro Tip - Use Ctrl+Enter to convert the text.</span>
		</React.Fragment>
	)
}

export default MorseToText
