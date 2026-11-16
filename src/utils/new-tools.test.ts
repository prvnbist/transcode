import { describe, expect, it } from 'vite-plus/test'

import * as enc from './encoding'
import { md5, sha1, sha256 } from './hash'
import { toTypescript, toZod } from './json'
import * as jwt from './jwt'
import { fromUnix, toUnix } from './timestamp'

describe('encoding', () => {
	it('round trips utf-8', () => {
		const text = 'héllo ✓ 😀'
		expect(enc.base64Decode(enc.base64Encode(text))).toBe(text)
		expect(enc.hexDecode(enc.hexEncode(text))).toBe(text)
		expect(enc.binaryDecode(enc.binaryEncode(text))).toBe(text)
		expect(enc.unicodeUnescape(enc.unicodeEscape(text))).toBe(text)
	})
	it('encodes known values', () => {
		expect(enc.base64Encode('hello')).toBe('aGVsbG8=')
		expect(enc.base64Decode('aGVsbG8')).toBe('hello')
		expect(enc.hexEncode('Hi')).toBe('48 69')
		expect(enc.binaryEncode('A')).toBe('01000001')
		expect(enc.unicodeEscape('é')).toBe('\\u00e9')
		expect(enc.rot13('Hello')).toBe('Uryyb')
	})
	it('escapes html', () => {
		expect(enc.htmlEscape('<a href="x">&</a>')).toBe(
			'&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;'
		)
		expect(
			enc.htmlUnescape('&lt;b&gt; &#169; &#x2713; &copy; &bogus;')
		).toBe('<b> © ✓ © &bogus;')
	})
	it('reports bad input', () => {
		expect(enc.base64Decode('%%%')).toContain('could not be decoded')
		expect(enc.hexDecode('abc')).toContain('could not be decoded')
		expect(enc.binaryDecode('0102')).toContain('could not be decoded')
	})
})

describe('hash', () => {
	it('matches known digests', async () => {
		expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
		expect(md5('The quick brown fox jumps over the lazy dog')).toBe(
			'9e107d9d372bb6826bd81d3542a419d6'
		)
		expect(md5('a'.repeat(1000))).toBe('cabe45dcc9ae5b66ba86600cca6b8ba8')
		expect(await sha1('abc')).toBe(
			'a9993e364706816aba3e25717850c26c9cd0d89d'
		)
		expect(await sha256('abc')).toBe(
			'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
		)
	})
})

describe('jwt', () => {
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.sig'
	it('decodes header, payload and times', () => {
		const out = JSON.parse(jwt.decode(`Bearer ${token}`, 1516240000000))
		expect(out.header).toEqual({ alg: 'HS256', typ: 'JWT' })
		expect(out.payload.name).toBe('John Doe')
		expect(out.times).toEqual({
			issuedAt: '2018-01-18T01:30:22.000Z',
			expiresAt: '2018-01-18T02:30:22.000Z',
			expired: false
		})
	})
	it('rejects invalid tokens', () => {
		expect(jwt.decode('abc')).toContain('valid JWT')
		expect(jwt.validate('a.b')).toContain('valid JWT')
		expect(jwt.validate(token)).toBe('')
	})
})

describe('timestamp', () => {
	const now = Date.parse('2026-11-16T12:00:00Z')
	it('converts seconds and milliseconds', () => {
		expect(JSON.parse(fromUnix('1700000000', now)).iso).toBe(
			'2023-11-14T22:13:20.000Z'
		)
		expect(JSON.parse(fromUnix('1700000000000', now)).iso).toBe(
			'2023-11-14T22:13:20.000Z'
		)
		expect(
			JSON.parse(fromUnix(String(now / 1000 - 7200), now)).relative
		).toBe('2 hours ago')
		expect(fromUnix('soon')).toContain('Unix timestamp')
	})
	it('converts dates to unix', () => {
		expect(
			JSON.parse(toUnix('2026-11-16T12:00:00Z', now)).unixSeconds
		).toBe(now / 1000)
		expect(JSON.parse(toUnix('now', now)).relative).toBe('now')
		expect(toUnix('not a date')).toContain('valid date')
	})
})

describe('json types', () => {
	const input = JSON.stringify({
		id: 1,
		name: 'a',
		tags: ['x'],
		owner: null,
		'first-name': 'b',
		users: [
			{ id: 1, email: 'a@b.c' },
			{ id: 2, active: true }
		]
	})
	it('generates typescript', () => {
		expect(toTypescript(input)).toBe(
			[
				'export interface Root {',
				'\tid: number',
				'\tname: string',
				'\ttags: string[]',
				'\towner: null',
				'\t"first-name": string',
				'\tusers: User[]',
				'}',
				'',
				'export interface User {',
				'\tid: number',
				'\temail?: string',
				'\tactive?: boolean',
				'}',
				''
			].join('\n')
		)
		expect(toTypescript('[1, "a"]')).toBe(
			'export type Root = Array<number | string>\n'
		)
		expect(toTypescript('{oops')).toContain('Something went wrong')
	})
	it('generates zod with children first', () => {
		const out = toZod(
			'{"user":{"name":"a","age":null},"items":[{"n":1},{"n":null}]}'
		)
		expect(out).toContain("import { z } from 'zod'")
		expect(out.indexOf('UserSchema = z.object')).toBeLessThan(
			out.indexOf('RootSchema = z.object')
		)
		expect(out).toContain('\tn: z.number().nullable(),')
		expect(out).toContain('\titems: z.array(ItemSchema),')
		expect(out).toContain('export type Root = z.infer<typeof RootSchema>')
	})
})
