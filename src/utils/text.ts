import camelCase from 'lodash.camelcase'
import capitalize from 'lodash.capitalize'
import kebabCase from 'lodash.kebabcase'
import lowerCase from 'lodash.lowercase'
import snakeCase from 'lodash.snakecase'
import startCase from 'lodash.startcase'
import upperCase from 'lodash.uppercase'

export {
	camelCase,
	capitalize,
	kebabCase,
	lowerCase,
	snakeCase,
	startCase,
	upperCase
}

const lines = (input: string) => input.split(/\r?\n/)

export const pascalCase = (input: string) =>
	startCase(camelCase(input)).replace(/\s+/g, '')
export const constantCase = (input: string) => snakeCase(input).toUpperCase()
export const dotCase = (input: string) => snakeCase(input).replace(/_/g, '.')
export const reverse = (input: string) => Array.from(input).reverse().join('')

export const slugify = (input: string) =>
	kebabCase(input.normalize('NFKD').replace(/[̀-ͯ]/g, ''))

export const sortLines = (input: string) =>
	lines(input)
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
		.join('\n')

export const uniqueLines = (input: string) =>
	[...new Set(lines(input))].join('\n')

export const trimLines = (input: string) =>
	lines(input)
		.map(line => line.trim())
		.filter(Boolean)
		.join('\n')

export const stats = (input: string) =>
	JSON.stringify(
		{
			characters: Array.from(input).length,
			charactersWithoutSpaces: Array.from(input.replace(/\s/g, ''))
				.length,
			words: input.trim() ? input.trim().split(/\s+/).length : 0,
			lines: input ? lines(input).length : 0,
			paragraphs: input.split(/\n\s*\n/).filter(p => p.trim()).length,
			bytes: new TextEncoder().encode(input).length
		},
		null,
		4
	)
