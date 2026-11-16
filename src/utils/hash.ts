const toHex = (buffer: ArrayBuffer | Uint8Array) =>
	Array.from(new Uint8Array(buffer), b =>
		b.toString(16).padStart(2, '0')
	).join('')

const digest =
	(algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512') => async (input: string) =>
		toHex(
			await crypto.subtle.digest(
				algorithm,
				new TextEncoder().encode(input)
			)
		)

export const sha1 = digest('SHA-1')
export const sha256 = digest('SHA-256')
export const sha512 = digest('SHA-512')

// Web Crypto has no MD5, so it is implemented here (RFC 1321).
const S = [
	7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
	9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
	16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10,
	15, 21
]
const K = Array.from(
	{ length: 64 },
	(_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0
)

export const md5 = (input: string) => {
	const data = new TextEncoder().encode(input)
	const length = (((data.length + 8) >>> 6) + 1) * 64
	const bytes = new Uint8Array(length)
	bytes.set(data)
	bytes[data.length] = 0x80
	const view = new DataView(bytes.buffer)
	const bitLength = data.length * 8
	view.setUint32(length - 8, bitLength >>> 0, true)
	view.setUint32(length - 4, Math.floor(bitLength / 2 ** 32), true)

	let a0 = 0x67452301
	let b0 = 0xefcdab89
	let c0 = 0x98badcfe
	let d0 = 0x10325476

	for (let offset = 0; offset < length; offset += 64) {
		const M = Array.from({ length: 16 }, (_, i) =>
			view.getUint32(offset + i * 4, true)
		)
		let a = a0
		let b = b0
		let c = c0
		let d = d0
		for (let i = 0; i < 64; i++) {
			let f: number
			let g: number
			if (i < 16) {
				f = (b & c) | (~b & d)
				g = i
			} else if (i < 32) {
				f = (d & b) | (~d & c)
				g = (5 * i + 1) % 16
			} else if (i < 48) {
				f = b ^ c ^ d
				g = (3 * i + 5) % 16
			} else {
				f = c ^ (b | ~d)
				g = (7 * i) % 16
			}
			const sum = (a + f + K[i] + M[g]) >>> 0
			a = d
			d = c
			c = b
			b = (b + ((sum << S[i]) | (sum >>> (32 - S[i])))) >>> 0
		}
		a0 = (a0 + a) >>> 0
		b0 = (b0 + b) >>> 0
		c0 = (c0 + c) >>> 0
		d0 = (d0 + d) >>> 0
	}

	const out = new DataView(new ArrayBuffer(16))
	;[a0, b0, c0, d0].forEach((word, i) => out.setUint32(i * 4, word, true))
	return toHex(out.buffer)
}
