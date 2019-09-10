import React from 'react'
import ReactDOM from 'react-dom'
import GitHubButton from 'react-github-btn'

import './styles/index.scss'

// 0 - dot, 1 - dash
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

const Translator = () => {
	const [text, setText] = React.useState('')
	const morseText = React.useRef(null)
	const onSubmit = e => {
		e.preventDefault()
		const arrayOfWords = text.split(' ').map(word => word.toLowerCase())
		let morseWord = []
		arrayOfWords.map(word => {
			let parsed = [...word].map(letter =>
				morse[letter].map(i => (i === 0 ? '.' : '-')).join('')
			)
			return morseWord.push(parsed.join(' '))
		})
		morseText.current.value = morseWord.join(' / ')
	}
	return (
		<React.Fragment>
			<nav>
				<h2>Morse Translator</h2>
				<GitHubButton
					href="https://github.com/prvnbist/morse-translator"
					data-size="large"
					data-show-count="true"
					aria-label="Star prvnbist/morse-translator on GitHub">
					Star
				</GitHubButton>
			</nav>
			<form onSubmit={onSubmit}>
				<fieldset>
					<legend>Enter the text</legend>
					<textarea
						name="text"
						id="text"
						value={text}
						onChange={e => setText(e.target.value)}
					/>
				</fieldset>
				<button>Translate</button>
				<span>/ - Word Separator</span>
				<fieldset>
					<legend>Morse Code</legend>
					<textarea
						ref={morseText}
						name="morseText"
						id="morseText"
						readOnly
					/>
				</fieldset>
			</form>
		</React.Fragment>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Translator />, rootElement)
