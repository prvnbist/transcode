const ERROR = 'Invalid number, please check the input and try again!'

const safe = (fn: (input: string) => string) => (input: string) => {
	try {
		return fn(input)
	} catch {
		return ERROR
	}
}

const PREFIX: Record<number, string> = { 2: '0b', 8: '0o', 16: '0x' }
const DIGITS: Record<number, RegExp> = {
	2: /^[01]+$/,
	8: /^[0-7]+$/,
	10: /^\d+$/,
	16: /^[0-9a-f]+$/i
}

const parse = (raw: string, radix: number) => {
	let value = raw.trim().replace(/_/g, '')
	const negative = value.startsWith('-')
	if (negative) value = value.slice(1)
	const prefix = PREFIX[radix]
	if (prefix && value.toLowerCase().startsWith(prefix)) {
		value = value.slice(2)
	}
	if (!DIGITS[radix].test(value)) throw new Error('invalid digits')
	const parsed = BigInt(radix === 10 ? value : `${prefix}${value}`)
	return negative ? -parsed : parsed
}

const perLine = (fn: (line: string) => string) =>
	safe(input =>
		input
			.split(/\r?\n/)
			.filter(line => line.trim())
			.map(fn)
			.join('\n')
	)

const convert = (from: number, to: number) =>
	perLine(line => parse(line, from).toString(to))

export const decimalToBinary = convert(10, 2)
export const decimalToOctal = convert(10, 8)
export const decimalToHex = convert(10, 16)
export const binaryToDecimal = convert(2, 10)
export const octalToDecimal = convert(8, 10)
export const hexToDecimal = convert(16, 10)

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

export const bytesToHuman = perLine(line => {
	let value = Number(line.trim().replace(/[_,]/g, ''))
	if (!Number.isFinite(value) || value < 0) throw new Error('invalid')
	let unit = 0
	while (value >= 1024 && unit < UNITS.length - 1) {
		value /= 1024
		unit++
	}
	return unit === 0
		? `${value} B`
		: `${value.toFixed(2).replace(/\.?0+$/, '')} ${UNITS[unit]}`
})
