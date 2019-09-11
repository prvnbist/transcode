import React from 'react'

const TextToMorse = ({ morse }) => {
	const [text, setText] = React.useState('')
	const morseText = React.useRef(null)
	const onSubmit = e => {
		e.preventDefault()
		const arrayOfWords = text
			.replace(/\n/g, ' ')
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

	return (
		<React.Fragment>
			<form onSubmit={onSubmit} onKeyDown={e => shortcut(e)}>
				<fieldset>
					<legend>Enter the text</legend>
					<textarea
						name="text"
						id="text"
						value={text}
						onChange={e => setText(e.target.value)}
					/>
				</fieldset>
				<button type="submit">Translate</button>
				<span>/ - Word Separator</span>
				<fieldset>
					<legend>Morse Code</legend>
					<textarea
						style={{ fontWeight: 'bold' }}
						ref={morseText}
						name="morseText"
						id="morseText"
						readOnly
					/>
				</fieldset>
			</form>
			<span>Pro Tip - Use Ctrl+Enter to convert the text.</span>
		</React.Fragment>
	)
}

export default TextToMorse
