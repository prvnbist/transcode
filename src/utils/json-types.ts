type Primitive = 'string' | 'number' | 'boolean' | 'null' | 'unknown'
type Field = { shape: Shape; optional: boolean }
type Shape =
	| { kind: Primitive }
	| { kind: 'array'; item: Shape }
	| { kind: 'object'; fields: Record<string, Field> }
	| { kind: 'union'; options: Array<Shape> }

const infer = (value: unknown): Shape => {
	if (value === null) return { kind: 'null' }
	if (Array.isArray(value)) {
		return {
			kind: 'array',
			item: value.length
				? value.map(infer).reduce(merge)
				: { kind: 'unknown' }
		}
	}
	if (typeof value === 'object') {
		const fields: Record<string, Field> = {}
		for (const [key, child] of Object.entries(value)) {
			fields[key] = { shape: infer(child), optional: false }
		}
		return { kind: 'object', fields }
	}
	if (typeof value === 'string') return { kind: 'string' }
	if (typeof value === 'number') return { kind: 'number' }
	if (typeof value === 'boolean') return { kind: 'boolean' }
	return { kind: 'unknown' }
}

const optionsOf = (shape: Shape) =>
	shape.kind === 'union' ? shape.options : [shape]

/** Combines two shapes seen at the same position, e.g. across array items. */
const merge = (a: Shape, b: Shape): Shape => {
	if (a.kind === 'unknown') return b
	if (b.kind === 'unknown') return a
	if (a.kind === 'object' && b.kind === 'object') {
		const fields: Record<string, Field> = {}
		for (const key of new Set([
			...Object.keys(a.fields),
			...Object.keys(b.fields)
		])) {
			const left = a.fields[key]
			const right = b.fields[key]
			fields[key] =
				left && right
					? {
							shape: merge(left.shape, right.shape),
							optional: left.optional || right.optional
						}
					: { shape: (left ?? right).shape, optional: true }
		}
		return { kind: 'object', fields }
	}
	if (a.kind === 'array' && b.kind === 'array') {
		return { kind: 'array', item: merge(a.item, b.item) }
	}
	if (a.kind !== 'union' && a.kind === b.kind) return a

	const options = [...optionsOf(a)]
	for (const option of optionsOf(b)) {
		const index = options.findIndex(o => o.kind === option.kind)
		if (index === -1) options.push(option)
		else options[index] = merge(options[index], option)
	}
	return options.length === 1 ? options[0] : { kind: 'union', options }
}

const pascal = (value: string) => {
	const name = value
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map(word => word[0].toUpperCase() + word.slice(1))
		.join('')
	if (!name) return 'Item'
	return /^\d/.test(name) ? `_${name}` : name
}

const singular = (value: string) =>
	/[^s]s$/i.test(value) && value.length > 3
		? value.slice(0, -1)
		: `${value}Item`

const propertyKey = (key: string) =>
	/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)

type Printer = {
	primitive: (kind: Primitive) => string
	array: (item: string, itemShape: Shape) => string
	union: (parts: Array<string>, options: Array<Shape>) => string
	declare: (
		name: string,
		fields: Array<{ key: string; type: string; optional: boolean }>
	) => string
	alias: (name: string, type: string) => string
	ref: (name: string) => string
}

const generate = (input: string, printer: Printer, rootFirst: boolean) => {
	const shape = infer(JSON.parse(input))
	const used = new Set<string>()
	const declarations: Array<string> = []

	const unique = (hint: string) => {
		const base = pascal(hint)
		let name = base
		for (let i = 2; used.has(name); i++) name = `${base}${i}`
		used.add(name)
		return name
	}

	const emit = (node: Shape, hint: string): string => {
		switch (node.kind) {
			case 'array':
				return printer.array(emit(node.item, singular(hint)), node.item)
			case 'union':
				return printer.union(
					node.options.map(o => emit(o, hint)),
					node.options
				)
			case 'object': {
				const name = unique(hint)
				const fields = Object.entries(node.fields).map(
					([key, field]) => ({
						key: propertyKey(key),
						type: emit(field.shape, key),
						optional: field.optional
					})
				)
				declarations.push(printer.declare(name, fields))
				return printer.ref(name)
			}
			default:
				return printer.primitive(node.kind)
		}
	}

	if (shape.kind !== 'object') {
		used.add('Root')
		const type = emit(shape, 'Root')
		declarations.push(printer.alias('Root', type))
	} else {
		emit(shape, 'Root')
	}

	return `${(rootFirst ? declarations.reverse() : declarations).join('\n\n')}\n`
}

const typescript: Printer = {
	primitive: kind => kind,
	array: (item, itemShape) =>
		itemShape.kind === 'union' ? `Array<${item}>` : `${item}[]`,
	union: parts => parts.join(' | '),
	declare: (name, fields) =>
		`export interface ${name} {\n${fields
			.map(f => `\t${f.key}${f.optional ? '?' : ''}: ${f.type}`)
			.join('\n')}\n}`,
	alias: (name, type) => `export type ${name} = ${type}`,
	ref: name => name
}

const zod: Printer = {
	primitive: kind => `z.${kind}()`,
	array: item => `z.array(${item})`,
	union: (parts, options) => {
		const nullIndex = options.findIndex(o => o.kind === 'null')
		if (nullIndex !== -1 && parts.length === 2) {
			return `${parts[1 - nullIndex]}.nullable()`
		}
		return `z.union([${parts.join(', ')}])`
	},
	declare: (name, fields) =>
		`export const ${name}Schema = z.object({\n${fields
			.map(
				f => `\t${f.key}: ${f.type}${f.optional ? '.optional()' : ''},`
			)
			.join(
				'\n'
			)}\n})\n\nexport type ${name} = z.infer<typeof ${name}Schema>`,
	alias: (name, type) =>
		`export const ${name}Schema = ${type}\n\nexport type ${name} = z.infer<typeof ${name}Schema>`,
	ref: name => `${name}Schema`
}

export const jsonToTypescript = (input: string) =>
	generate(input, typescript, true)

export const jsonToZod = (input: string) =>
	`import { z } from 'zod'\n\n${generate(input, zod, false)}`
