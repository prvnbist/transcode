const INVALID_UNIX = 'Please enter a Unix timestamp in seconds or milliseconds!'
const INVALID_DATE = 'Please enter a valid date, e.g. 2026-11-16T10:30:00Z!'

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
	['year', 365 * 24 * 3600],
	['month', 30 * 24 * 3600],
	['week', 7 * 24 * 3600],
	['day', 24 * 3600],
	['hour', 3600],
	['minute', 60],
	['second', 1]
]

export const relative = (date: Date, now = Date.now()) => {
	const diff = Math.round((date.getTime() - now) / 1000)
	const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
	for (const [unit, seconds] of UNITS) {
		if (Math.abs(diff) >= seconds || unit === 'second') {
			return formatter.format(Math.round(diff / seconds), unit)
		}
	}
	return ''
}

const describe = (date: Date, now: number) =>
	JSON.stringify(
		{
			iso: date.toISOString(),
			utc: date.toUTCString(),
			local: date.toString(),
			relative: relative(date, now),
			unixSeconds: Math.floor(date.getTime() / 1000),
			unixMilliseconds: date.getTime()
		},
		null,
		4
	)

export const fromUnix = (input: string, now = Date.now()) => {
	const value = input.trim()
	if (!/^-?\d+(\.\d+)?$/.test(value)) return INVALID_UNIX
	const number = Number(value)
	// 12+ digit values are treated as milliseconds
	const ms = Math.abs(number) >= 1e11 ? number : number * 1000
	const date = new Date(ms)
	return Number.isNaN(date.getTime()) ? INVALID_UNIX : describe(date, now)
}

export const toUnix = (input: string, now = Date.now()) => {
	const value = input.trim()
	const date = value.toLowerCase() === 'now' ? new Date(now) : new Date(value)
	return !value || Number.isNaN(date.getTime())
		? INVALID_DATE
		: describe(date, now)
}
