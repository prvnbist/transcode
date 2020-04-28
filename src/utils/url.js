import Url from 'url-parse'
import isUrl from 'is-url'

export const parseUrl = url =>
	isUrl(url) ? JSON.stringify(new Url(url), null, 4) : ''

export const isUrlValid = url => {
	if (url) {
		return isUrl(url) ? '' : 'Invalid URL'
	}
	return ''
}
