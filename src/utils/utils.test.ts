import { describe, expect, it } from 'vite-plus/test'

import { hexToRgb, rgbToHex } from './colors'
import { toYaml } from './json'
import { morseToText, textToMorse, validateTextToMorse } from './morse'
import { camelCase, kebabCase, snakeCase } from './text'
import { decode, extractLinks, parse } from './url'

describe('morse', () => {
	it('round trips text', () => {
		expect(textToMorse('sos now')).toBe('... --- ... / -. --- .--')
		expect(morseToText('... --- ... / -. --- .--')).toBe('sos now')
	})
	it('reports invalid characters', () => {
		expect(validateTextToMorse('a,b')).toContain('Invalid character')
		expect(validateTextToMorse('ab')).toBe('')
	})
})

describe('text', () => {
	it('transforms case', () => {
		expect(camelCase('hello big world')).toBe('helloBigWorld')
		expect(kebabCase('helloWorld foo_bar')).toBe('hello-world-foo-bar')
		expect(snakeCase('helloWorld foo')).toBe('hello_world_foo')
	})
})

describe('url', () => {
	it('parses and extracts', () => {
		expect(parse('nope')).toBe('Please enter a valid URL!')
		expect(JSON.parse(parse('https://a.com/x?y=1#z'))).toMatchObject({
			hostname: 'a.com',
			pathname: '/x',
			hash: '#z'
		})
		expect(JSON.parse(extractLinks('go to https://a.com now'))).toEqual([
			'https://a.com'
		])
		expect(decode('a%20b')).toBe('a b')
	})
})

describe('json & colors', () => {
	it('converts', () => {
		expect(toYaml('{"a":1}')).toBe('a: 1\n')
		expect(hexToRgb('#ff0000')).toBe('255,0,0')
		expect(rgbToHex('255, 0, 0')).toBe('#FF0000')
		expect(hexToRgb('zzz')).toContain('valid')
	})
})
