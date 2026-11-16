import postcss from 'postcss'
import postcssJs from 'postcss-js'

export const cssToJs = (input: string) => {
	try {
		return JSON.stringify(
			postcssJs.objectify(postcss.parse(input)),
			null,
			4
		)
	} catch {
		return 'Something went wrong during conversion, please try again!'
	}
}
