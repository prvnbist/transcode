import { jsonToSchema } from '@walmartlabs/json-to-simple-graphql-schema/lib'
import { XMLBuilder } from 'fast-xml-parser'
import Papa from 'papaparse'
import gs from 'generate-schema'
import yaml from 'yaml'

import { jsonToTypescript, jsonToZod } from './json-types'

const ERROR = 'Something went wrong during conversion, please try again!'

const safe = (fn: (input: string) => string) => (input: string) => {
	try {
		return fn(input)
	} catch {
		return ERROR
	}
}

const pretty = (value: unknown) => JSON.stringify(value, null, 4)

export const toYaml = safe(input => yaml.stringify(JSON.parse(input)))
// generate-schema's Mongoose generator runs `value instanceof Buffer`, which
// throws a ReferenceError where Buffer doesn't exist (browsers). Parsed JSON
// never contains buffers, so a stand-in class that nothing matches is enough.
const ensureBuffer = () => {
	const g = globalThis as { Buffer?: unknown }
	g.Buffer ??= class Buffer {}
}

export const toMongoose = safe(input => {
	ensureBuffer()
	return pretty(gs.mongoose(JSON.parse(input)))
})
export const toMysql = safe(input => gs.mysql(JSON.parse(input)))
export const toJsonSchema = safe(input => pretty(gs.json(JSON.parse(input))))
export const toBigQuery = safe(input => pretty(gs.bigquery(JSON.parse(input))))
export const toGraphql = safe(input => jsonToSchema({ jsonInput: input }).value)
export const toTypescript = safe(jsonToTypescript)
export const toZod = safe(jsonToZod)

export const format = safe(input => pretty(JSON.parse(input)))
export const minify = safe(input => JSON.stringify(JSON.parse(input)))

export const toCsv = safe(input => {
	const data = JSON.parse(input)
	const rows = Array.isArray(data) ? data : [data]
	return Papa.unparse(
		rows.map(row =>
			Object.fromEntries(
				Object.entries(row ?? {}).map(([k, v]) => [
					k,
					v !== null && typeof v === 'object' ? JSON.stringify(v) : v
				])
			)
		)
	)
})

export const toXml = safe(input => {
	const data = JSON.parse(input)
	const isSingleRoot =
		data !== null &&
		typeof data === 'object' &&
		!Array.isArray(data) &&
		Object.keys(data).length === 1 &&
		!Array.isArray(Object.values(data)[0])
	const builder = new XMLBuilder({
		format: true,
		indentBy: '    ',
		ignoreAttributes: false,
		suppressEmptyNode: true
	})
	const wrapped = isSingleRoot
		? data
		: { root: Array.isArray(data) ? { item: data } : data }
	return (builder.build(wrapped) as string).trim()
})
