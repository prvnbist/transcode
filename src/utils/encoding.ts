const ERROR = 'Input could not be decoded, please check it and try again!'

const safe = (fn: (input: string) => string) => (input: string) => {
	try {
		return fn(input)
	} catch {
		return ERROR
	}
}

const toBytes = (input: string) => new TextEncoder().encode(input)
const fromBytes = (bytes: Uint8Array) =>
	new TextDecoder('utf-8', { fatal: true }).decode(bytes)

export const base64Encode = (input: string) => {
	let binary = ''
	for (const byte of toBytes(input)) binary += String.fromCharCode(byte)
	return btoa(binary)
}

export const base64Decode = safe(input => {
	// accept base64url and missing padding
	const normalized = input
		.trim()
		.replace(/\s/g, '')
		.replace(/-/g, '+')
		.replace(/_/g, '/')
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
	const binary = atob(padded)
	return fromBytes(Uint8Array.from(binary, c => c.charCodeAt(0)))
})

export const hexEncode = (input: string) =>
	Array.from(toBytes(input), b => b.toString(16).padStart(2, '0')).join(' ')

export const hexDecode = safe(input => {
	const clean = input.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '')
	if (clean.length % 2 !== 0) throw new Error('odd length')
	const bytes = new Uint8Array(clean.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
	}
	return fromBytes(bytes)
})

export const binaryEncode = (input: string) =>
	Array.from(toBytes(input), b => b.toString(2).padStart(8, '0')).join(' ')

export const binaryDecode = safe(input => {
	const groups = input.trim().split(/\s+/).filter(Boolean)
	if (groups.some(g => !/^[01]{1,8}$/.test(g))) throw new Error('invalid')
	return fromBytes(Uint8Array.from(groups, g => parseInt(g, 2)))
})

const ENTITIES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
}

const NAMED: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: ' ',
	copy: '©',
	reg: '®',
	trade: '™',
	hellip: '…',
	mdash: '—',
	ndash: '–'
}

export const htmlEscape = (input: string) =>
	input.replace(/[&<>"']/g, c => ENTITIES[c])

export const htmlUnescape = (input: string) =>
	input.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
		if (body[0] === '#') {
			const code =
				body[1].toLowerCase() === 'x'
					? parseInt(body.slice(2), 16)
					: parseInt(body.slice(1), 10)
			return Number.isNaN(code) ? match : String.fromCodePoint(code)
		}
		return NAMED[body.toLowerCase()] ?? match
	})

export const unicodeEscape = (input: string) =>
	Array.from(input, char => {
		const code = char.codePointAt(0) ?? 0
		if (code >= 0x20 && code < 0x7f) return char
		if (code > 0xffff) return `\\u{${code.toString(16)}}`
		return `\\u${code.toString(16).padStart(4, '0')}`
	}).join('')

export const unicodeUnescape = (input: string) =>
	input
		.replace(/\\u\{([0-9a-f]+)\}/gi, (_, hex: string) =>
			String.fromCodePoint(parseInt(hex, 16))
		)
		.replace(/\\u([0-9a-f]{4})/gi, (_, hex: string) =>
			String.fromCharCode(parseInt(hex, 16))
		)

export const rot13 = (input: string) =>
	input.replace(/[a-z]/gi, c => {
		const base = c <= 'Z' ? 65 : 97
		return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
	})
