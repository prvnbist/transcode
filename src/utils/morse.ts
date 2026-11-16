const TEXT_TO_MORSE_REGEX = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./@#]/g
const MORSE_TO_TEXT_REGEX = /[!$%^&*()_+|~=`{}[\]:";'<>?,@#0-9a-z]/gi

const validate = (match: RegExp) => (value: string) => {
	const chars = value.replace(/\n/g, ' ').match(match)
	if (chars && chars.length > 0) {
		return `Invalid character${chars.length === 1 ? '' : 's'} will be omitted!: ${chars.join(' ')}`
	}
	return ''
}

export const validateTextToMorse = validate(TEXT_TO_MORSE_REGEX)
export const validateMorseToText = validate(MORSE_TO_TEXT_REGEX)

const TEXT_TO_MORSE: Record<string, number[]> = {
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

const MORSE_TO_TEXT: Record<string, string> = Object.fromEntries(
	Object.entries(TEXT_TO_MORSE).map(([letter, code]) => [
		code.join(''),
		letter
	])
)

export const textToMorse = (value: string) =>
	value
		.replace(/\n/g, ' ')
		.replace(TEXT_TO_MORSE_REGEX, '')
		.split(' ')
		.map(word => word.toLowerCase())
		.filter(Boolean)
		.map(word =>
			[...word.trim()]
				.filter(Boolean)
				.map(letter =>
					(TEXT_TO_MORSE[letter] ?? [])
						.map(i => (i === 0 ? '.' : '-'))
						.join('')
				)
				.join(' ')
		)
		.join(' / ')

export const morseToText = (value: string) =>
	value
		.replace(/\n/g, ' ')
		.split('/')
		.map(word => word.split(' ').filter(Boolean))
		.map(word =>
			word
				.map(letter => {
					const binary = letter
						.split('')
						.map(code => (code === '-' ? 1 : 0))
						.join('')
					return MORSE_TO_TEXT[binary] ?? ''
				})
				.join('')
		)
		.join(' ')
