import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import Papa from 'papaparse'
import yaml from 'yaml'

const ERROR = 'Something went wrong during conversion, please try again!'

const safe = (fn: (input: string) => string) => (input: string) => {
	try {
		return fn(input)
	} catch {
		return ERROR
	}
}

const pretty = (value: unknown) => JSON.stringify(value, null, 4)

const xmlOptions = {
	ignoreAttributes: false,
	attributeNamePrefix: '@_',
	parseAttributeValue: true
}

export const yamlToJson = safe(input => pretty(yaml.parse(input) ?? null))

export const csvToJson = safe(input => {
	const result = Papa.parse<Record<string, unknown>>(input.trim(), {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true
	})
	if (result.errors.length && !result.data.length) throw new Error('invalid')
	return pretty(result.data)
})

const parseXml = (input: string) => {
	if (!input.trim().startsWith('<')) throw new Error('not xml')
	return new XMLParser(xmlOptions).parse(input, true)
}

export const xmlToJson = safe(input => pretty(parseXml(input)))

export const xmlFormat = safe(input =>
	(
		new XMLBuilder({
			...xmlOptions,
			format: true,
			indentBy: '    ',
			suppressEmptyNode: true
		}).build(parseXml(input)) as string
	).trim()
)
