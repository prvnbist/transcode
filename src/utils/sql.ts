import { format as formatSql } from 'sql-formatter'

const ERROR = 'Could not format the SQL, please check it and try again!'

export const format = (input: string) => {
	try {
		return formatSql(input, { tabWidth: 4, keywordCase: 'upper' })
	} catch {
		return ERROR
	}
}

// Collapse whitespace and strip comments, leaving quoted strings untouched.
const QUOTED = /('(?:[^']|'')*'|"(?:[^"]|"")*"|`[^`]*`)/

export const minify = (input: string) =>
	input
		.split(QUOTED)
		.map((part, i) =>
			i % 2 === 1
				? part
				: part
						.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, ' ')
						.replace(/\s+/g, ' ')
						.replace(/\s*([(),;=<>+*/-])\s*/g, '$1')
		)
		.join('')
		.trim()
