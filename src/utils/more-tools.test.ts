import { describe, expect, it } from 'vite-plus/test'

import * as cron from './cron'
import * as formats from './formats'
import * as generate from './generate'
import * as json from './json'
import * as number from './number'
import * as sql from './sql'
import * as text from './text'

describe('data formats', () => {
	it('formats and minifies json', () => {
		expect(json.minify('{ "a": [1, 2] }')).toBe('{"a":[1,2]}')
		expect(json.format('{"a":1}')).toBe('{\n    "a": 1\n}')
		expect(json.format('{bad')).toContain('Something went wrong')
	})
	it('round trips json and csv', () => {
		const csv = json.toCsv(
			'[{"name":"Ann, B","age":3},{"name":"C","age":4}]'
		)
		expect(csv).toBe('name,age\r\n"Ann, B",3\r\nC,4')
		expect(JSON.parse(formats.csvToJson(csv))).toEqual([
			{ name: 'Ann, B', age: 3 },
			{ name: 'C', age: 4 }
		])
	})
	it('round trips json and xml', () => {
		const xml = json.toXml('{"note":{"to":"Tove","n":2}}')
		expect(xml).toContain('<to>Tove</to>')
		expect(JSON.parse(formats.xmlToJson(xml))).toEqual({
			note: { to: 'Tove', n: 2 }
		})
		expect(json.toXml('[1,2]')).toContain('<root>')
		expect(formats.xmlToJson('nope')).toContain('Something went wrong')
		expect(formats.xmlFormat('<a><b>1</b></a>')).toBe(
			'<a>\n    <b>1</b>\n</a>'
		)
	})
	it('converts yaml to json', () => {
		expect(JSON.parse(formats.yamlToJson('a: 1\nb: [x, y]'))).toEqual({
			a: 1,
			b: ['x', 'y']
		})
	})
})

describe('text extras', () => {
	it('changes case', () => {
		expect(text.pascalCase('hello world-foo')).toBe('HelloWorldFoo')
		expect(text.constantCase('helloWorld')).toBe('HELLO_WORLD')
		expect(text.dotCase('Hello World')).toBe('hello.world')
		expect(text.slugify('Crème Brûlée!')).toBe('creme-brulee')
		expect(text.reverse('ab😀')).toBe('😀ba')
	})
	it('handles lines', () => {
		expect(text.sortLines('b\na10\na2')).toBe('a2\na10\nb')
		expect(text.uniqueLines('a\nb\na')).toBe('a\nb')
		expect(text.trimLines('  a \n\n b')).toBe('a\nb')
	})
	it('counts stats', () => {
		expect(JSON.parse(text.stats('hi there\n\né'))).toEqual({
			characters: 11,
			charactersWithoutSpaces: 8,
			words: 3,
			lines: 3,
			paragraphs: 2,
			bytes: 12
		})
	})
})

describe('number', () => {
	it('converts bases', () => {
		expect(number.decimalToHex('255\n16')).toBe('ff\n10')
		expect(number.decimalToBinary('5')).toBe('101')
		expect(number.decimalToOctal('8')).toBe('10')
		expect(number.hexToDecimal('0xFF')).toBe('255')
		expect(number.binaryToDecimal('0b1_0000')).toBe('16')
		expect(number.octalToDecimal('-17')).toBe('-15')
		expect(number.decimalToHex('18446744073709551616')).toBe(
			'10000000000000000'
		)
	})
	it('rejects bad input', () => {
		expect(number.binaryToDecimal('102')).toContain('Invalid number')
		expect(number.hexToDecimal('zz')).toContain('Invalid number')
	})
	it('formats bytes', () => {
		expect(number.bytesToHuman('512')).toBe('512 B')
		expect(number.bytesToHuman('1536')).toBe('1.5 KB')
		expect(number.bytesToHuman('1073741824')).toBe('1 GB')
	})
})

describe('generate', () => {
	it('makes uuids', () => {
		const ids = generate.uuid('3').split('\n')
		expect(ids).toHaveLength(3)
		for (const id of ids) {
			expect(id).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
			)
		}
		expect(generate.uuid('')).not.toContain('\n')
	})
	it('makes lorem paragraphs', () => {
		const out = generate.lorem('4')
		expect(out.split('\n\n')).toHaveLength(4)
		expect(out.startsWith('Lorem ipsum dolor sit amet,')).toBe(true)
	})
})

describe('sql', () => {
	it('formats', () => {
		expect(sql.format('select a,b from t where x=1')).toBe(
			'SELECT\n    a,\n    b\nFROM\n    t\nWHERE\n    x = 1'
		)
	})
	it('minifies but keeps strings', () => {
		expect(
			sql.minify(
				"SELECT a ,  b -- c\nFROM t\n/* x */ WHERE n = 'a  =  b'"
			)
		).toBe("SELECT a,b FROM t WHERE n='a  =  b'")
	})
})

describe('cron', () => {
	it('describes expressions', () => {
		expect(cron.describe('*/5 * * * *')).toBe(
			'Every 5 minutes, every hour, every day'
		)
		expect(cron.describe('nope')).toContain('Invalid cron')
		expect(cron.validate('* *')).toContain('Expected 5 to 7')
		expect(cron.validate('0 0 * * *')).toBe('')
	})
})
