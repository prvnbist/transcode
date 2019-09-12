import React from 'react'

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
			<form onSubmit={onSubmit} onKeyDown={e => shortcut(e)}>
				<fieldset>
					<legend>Enter the text</legend>
					<textarea
						name="text"
						id="text"
						value={text}
						onChange={e =>
							setText(e.target.value) || validate(e.target.value)
						}
					/>
				</fieldset>
				{errors && <div id="errors">{errors}</div>}
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
