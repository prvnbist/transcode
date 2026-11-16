declare module 'generate-schema' {
	const gs: {
		json: (value: unknown) => unknown
		mongoose: (value: unknown) => unknown
		mysql: (value: unknown) => string
		bigquery: (value: unknown) => unknown
	}
	export default gs
}

declare module 'html-to-ast' {
	export const parse: (html: string) => unknown
}

declare module 'html2pug' {
	const html2pug: (html: string, options?: { tabs?: boolean }) => string
	export default html2pug
}

declare module '@walmartlabs/json-to-simple-graphql-schema/lib' {
	export const jsonToSchema: (options: { jsonInput: string }) => {
		value: string
	}
}
