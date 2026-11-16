import { base64Decode } from './encoding'

const INVALID = 'Please enter a valid JWT (header.payload.signature)!'

const decodePart = (part: string) =>
	JSON.parse(base64Decode(part)) as Record<string, unknown>

const toIso = (value: unknown) =>
	typeof value === 'number' ? new Date(value * 1000).toISOString() : undefined

export const validate = (input: string) => {
	const token = input.trim()
	if (!token) return ''
	return token.split('.').length === 3 ? '' : INVALID
}

export const decode = (input: string, now = Date.now()) => {
	const parts = input
		.trim()
		.replace(/^Bearer\s+/i, '')
		.split('.')
	if (parts.length !== 3) return INVALID
	try {
		const header = decodePart(parts[0])
		const payload = decodePart(parts[1])
		const { exp, iat, nbf } = payload
		const times = {
			issuedAt: toIso(iat),
			notBefore: toIso(nbf),
			expiresAt: toIso(exp),
			expired: typeof exp === 'number' ? exp * 1000 < now : undefined
		}
		return JSON.stringify(
			{
				header,
				payload,
				...(Object.values(times).some(v => v !== undefined) && {
					times
				})
			},
			null,
			4
		)
	} catch {
		return INVALID
	}
}
