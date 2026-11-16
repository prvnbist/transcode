import { createServerFn } from '@tanstack/react-start'

const ERROR = 'Something went wrong during conversion, please try again!'

const validate = (data: { input: string }) => ({ input: String(data.input) })

export const htmlToPug = createServerFn({ method: 'POST' })
	.validator(validate)
	.handler(async ({ data }) => {
		try {
			const { default: html2pug } = await import('html2pug')
			return html2pug(data.input, { tabs: true })
		} catch {
			return ERROR
		}
	})

export const htmlToJsx = createServerFn({ method: 'POST' })
	.validator(validate)
	.handler(async ({ data }) => {
		try {
			const { htmlToJsx: transform } =
				await import('html-to-jsx-transform')
			return `export const MyComponent = () => (${transform(data.input)})`
		} catch {
			return ERROR
		}
	})
