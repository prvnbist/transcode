import { parse } from 'html-to-ast'

export const htmlToAst = (input: string) => {
	try {
		return JSON.stringify(parse(input), null, 4)
	} catch {
		return 'Something went wrong during conversion, please try again!'
	}
}
