import getUrls from 'get-urls'
import isUrl from 'is-url'
import Url from 'url-parse'

export const encode = (input: string) => encodeURIComponent(input)

export const decode = (input: string) => {
	try {
		return decodeURIComponent(input)
	} catch {
		return 'Please enter a valid encoded string.'
	}
}

export const parse = (input: string) => {
	if (!isUrl(input)) return 'Please enter a valid URL!'
	return JSON.stringify(new Url(input), null, 3)
}

export const extractLinks = (input: string) =>
	JSON.stringify(Array.from(getUrls(input)), null, 3)
