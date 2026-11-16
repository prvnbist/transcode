import convert from 'color-convert'

type Kind = 'hex' | 'rgb' | 'keyword'

const HEX = /^([0-9a-f]{3}|[0-9a-f]{6})$/i

const parseInput = (kind: Kind, input: string) => {
	if (kind === 'hex') {
		const hex = input.trim().replace('#', '')
		if (!HEX.test(hex)) throw new Error('invalid')
		return hex
	}
	if (kind === 'rgb') {
		const parts = input.split(',').map(n => Number(n.trim()))
		if (parts.length !== 3 || parts.some(n => Number.isNaN(n)))
			throw new Error('invalid')
		return parts
	}
	return input.trim()
}

const make =
	(from: Kind, to: string, format = (value: unknown) => `${value}`) =>
	(input: string) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const fn = (convert as any)[from][to]
			const result = fn(parseInput(from, input))
			if (result === undefined || result === null)
				throw new Error('invalid')
			return format(result)
		} catch {
			return `Please input a valid ${from} color.`
		}
	}

export const hexToRgb = make('hex', 'rgb')
export const hexToCmyk = make('hex', 'cmyk')
export const hexToHsl = make('hex', 'hsl')
export const hexToHsv = make('hex', 'hsv')
export const rgbToHex = make('rgb', 'hex', v => `#${v}`)
export const rgbToCmyk = make('rgb', 'cmyk')
export const rgbToHsl = make('rgb', 'hsl')
export const rgbToHsv = make('rgb', 'hsv')
export const keywordToHex = make('keyword', 'hex', v => `#${v}`)
export const keywordToRgb = make('keyword', 'rgb')
