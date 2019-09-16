import React from 'react'

import {
	Form,
	FieldSet,
	Legend,
	TextArea,
	Tip,
	Error,
	Button,
	Title3
} from '../../styles/index'

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

const playTone = (type, x) => {
	var context = new AudioContext()
	var o = null
	var g = null
	o = context.createOscillator()
	g = context.createGain()
	o.connect(g)
	o.type = type
	g.connect(context.destination)
	o.start(0)
	g.gain.exponentialRampToValueAtTime(0.000001, context.currentTime + x)
}

const TextToMorse = () => {
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

	const handleClick = () => {
		console.log(morseText.current.value)
		let initialTime = 0
		morseText.current.value.split('').map(element => {
			setTimeout(() => {
				if (element == '.') playTone('triangle', 1)
				if (element == '-') playTone('triangle', 2)
			}, initialTime)
			if (element != '/') {
				if (element == '-') initialTime += 350
				else initialTime += 150
			}
		})
	}

	return (
		<React.Fragment>
			<Title3 pt={3} pb={3}>
				Text to Morse
			</Title3>
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
				<Button type="submit" mb={3}>
					Translate
				</Button>
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
			<button onClick={() => handleClick()}>Play ▶️</button>
			<br />
			<span>Pro Tip - Use Ctrl+Enter to convert the text.</span>
		</React.Fragment>
	)
}

export default TextToMorse
