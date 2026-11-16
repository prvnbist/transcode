const count = (input: string, fallback: number, max: number) => {
	const n = Number.parseInt(input.trim(), 10)
	if (!Number.isFinite(n) || n < 1) return fallback
	return Math.min(n, max)
}

export const uuid = (input: string) =>
	Array.from({ length: count(input, 1, 1000) }, () =>
		crypto.randomUUID()
	).join('\n')

const WORDS = (
	'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod ' +
	'tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam ' +
	'quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo ' +
	'consequat duis aute irure in reprehenderit voluptate velit esse cillum ' +
	'eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident ' +
	'sunt culpa qui officia deserunt mollit anim id est laborum'
).split(' ')

const rand = (min: number, max: number) =>
	min + Math.floor(Math.random() * (max - min + 1))

const sentence = () => {
	const words = Array.from(
		{ length: rand(6, 14) },
		() => WORDS[rand(0, WORDS.length - 1)]
	)
	const text = words.join(' ')
	return `${text[0].toUpperCase()}${text.slice(1)}.`
}

const paragraph = () => Array.from({ length: rand(3, 6) }, sentence).join(' ')

export const lorem = (input: string) => {
	const paragraphs = Array.from({ length: count(input, 3, 50) }, paragraph)
	paragraphs[0] = `Lorem ipsum dolor sit amet, ${paragraphs[0][0].toLowerCase()}${paragraphs[0].slice(1)}`
	return paragraphs.join('\n\n')
}
