import cronstrue from 'cronstrue'

const ERROR = 'Invalid cron expression, please check it and try again!'

export const describe = (input: string) => {
	try {
		return cronstrue.toString(input.trim(), {
			throwExceptionOnParseError: true,
			use24HourTimeFormat: false,
			verbose: true
		})
	} catch {
		return ERROR
	}
}

export const validate = (input: string) => {
	const fields = input.trim().split(/\s+/).filter(Boolean)
	if (!input.trim() || input.trim().startsWith('@')) return ''
	return fields.length < 5 || fields.length > 7
		? `Expected 5 to 7 fields, got ${fields.length}.`
		: ''
}
