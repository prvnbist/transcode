import { findTranslator } from '#/tools'
import type { Tool, Translator } from '#/tools'

export type Faq = { q: string; a: string }
export type ToolContent = { intro: string; faqs: Array<Faq> }

/** Hand-written copy for each tool group, keyed by tool slug. */
export const content: Record<string, ToolContent> = {
	text: {
		intro: 'Change the case and structure of text in one click. Convert to camelCase, snake_case, kebab-case and more, or sort, dedupe and trim lines.',
		faqs: [
			{
				q: 'Which case formats are supported?',
				a: 'camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, dot.case, Start Case, lower case, UPPER CASE and Capitalize.'
			},
			{
				q: 'Is my text sent to a server?',
				a: 'No. Text conversions run in your browser, so what you paste stays on your device. Only the optional HTTP API (/api) processes input on the server, and nothing is stored.'
			}
		]
	},
	url: {
		intro: 'Encode and decode URLs, break a URL into its parts, or pull every link out of a block of text.',
		faqs: [
			{
				q: 'What is URL encoding?',
				a: 'URL encoding (percent-encoding) replaces characters that are not allowed in a URL, such as spaces and ampersands, with a % followed by two hex digits.'
			},
			{
				q: 'What does the URL parser return?',
				a: 'The protocol, host, port, path, query and hash of a URL as JSON.'
			}
		]
	},
	html: {
		intro: 'Convert HTML to Pug templates, JSX for React, or a JSON syntax tree.',
		faqs: [
			{
				q: 'Does the JSX output work in React?',
				a: 'Yes. Attributes such as class and for become className and htmlFor, and inline styles become objects. Review event handlers and custom attributes by hand.'
			},
			{
				q: 'Where does the conversion run?',
				a: 'HTML to Pug and HTML to JSX are processed on the server and are not stored. HTML to AST runs in your browser.'
			}
		]
	},
	css: {
		intro: 'Turn CSS rules into a JavaScript object you can use in CSS-in-JS.',
		faqs: [
			{
				q: 'What does the output look like?',
				a: 'A JSON object keyed by selector, with each declaration as a property, ready to adapt for CSS-in-JS.'
			},
			{
				q: 'Where can I use the result?',
				a: 'In any CSS-in-JS library that accepts style objects, such as styled-components or Emotion. Check property names against the library you use.'
			}
		]
	},
	json: {
		intro: 'Format and minify JSON, or convert it to YAML, CSV, XML, TypeScript, Zod, JSON Schema, GraphQL, SQL and more.',
		faqs: [
			{
				q: 'How do I generate types from JSON?',
				a: 'Paste a sample object and choose TypeScript, Zod Schema or JSON Schema. The tool infers a type from the values it sees, so use a representative sample.'
			},
			{
				q: 'Why does my JSON fail to convert?',
				a: 'Most failures come from trailing commas, single quotes or unquoted keys. JSON requires double quotes and no trailing commas.'
			},
			{
				q: 'Is my JSON uploaded?',
				a: 'No. JSON conversions run in your browser.'
			}
		]
	},
	yaml: {
		intro: 'Convert YAML documents to JSON.',
		faqs: [
			{
				q: 'Are YAML comments kept?',
				a: 'No. JSON has no comment syntax, so comments are dropped during conversion.'
			},
			{
				q: 'How do I convert JSON to YAML?',
				a: 'Use the JSON to YAML converter, which is linked under related tools.'
			}
		]
	},
	csv: {
		intro: 'Convert CSV rows into a JSON array of objects.',
		faqs: [
			{
				q: 'Does the first row become the keys?',
				a: 'Yes. The first row is used as the header, and every following row becomes an object.'
			},
			{
				q: 'Are numbers converted to numbers?',
				a: 'Yes. Numeric and boolean-looking values are converted to real numbers and booleans, and empty cells become null.'
			}
		]
	},
	xml: {
		intro: 'Format XML for readability or convert it to JSON.',
		faqs: [
			{
				q: 'How are XML attributes represented in JSON?',
				a: 'Attributes become properties prefixed with @_, which keeps them apart from child elements.'
			},
			{
				q: 'Can it fix invalid XML?',
				a: 'No. Malformed XML such as unclosed tags will return an error.'
			}
		]
	},
	sql: {
		intro: 'Format SQL queries with consistent indentation, or minify them.',
		faqs: [
			{
				q: 'Which SQL dialects work?',
				a: 'Standard SQL formatting works for most queries. Dialect-specific syntax may be laid out less precisely.'
			},
			{
				q: 'Does it change what the query does?',
				a: 'No. Formatting only changes whitespace and upper-cases keywords. Minify strips comments and extra whitespace.'
			}
		]
	},
	colors: {
		intro: 'Convert colors between HEX, RGB, HSL, HSV and CMYK, or look up a CSS color name.',
		faqs: [
			{
				q: 'What is the difference between HSL and HSV?',
				a: 'Both describe hue and saturation. HSL uses lightness, while HSV uses value (brightness), so the same color has different saturation numbers in each.'
			},
			{
				q: 'Which input format does HEX expect?',
				a: 'A 3 or 6 digit hex code such as #5e6ad2, with or without the leading #.'
			}
		]
	},
	morse: {
		intro: 'Translate text to Morse code and Morse code back to text.',
		faqs: [
			{
				q: 'How should Morse code be written?',
				a: 'Use dots and dashes, a space between letters and a slash between words.'
			},
			{
				q: 'Which characters are supported?',
				a: 'Letters, digits and common punctuation. Unsupported characters are left out and listed in a warning.'
			}
		]
	},
	encoding: {
		intro: 'Encode and decode Base64, hex, binary, HTML entities and Unicode escapes, or apply ROT13.',
		faqs: [
			{
				q: 'Is Base64 encryption?',
				a: 'No. Base64 is a reversible encoding, not encryption. Anyone can decode it, so never use it to protect secrets.'
			},
			{
				q: 'Does it handle Unicode text?',
				a: 'Yes. Text is encoded as UTF-8 before it is converted, so emoji and accented characters round-trip correctly.'
			}
		]
	},
	hash: {
		intro: 'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes of any text.',
		faqs: [
			{
				q: 'Which hash should I use?',
				a: 'Use SHA-256 or SHA-512 for integrity checks. MD5 and SHA-1 are broken for security purposes and are only suitable for checksums.'
			},
			{
				q: 'Can a hash be reversed?',
				a: 'No. Hashing is one way, so the original text cannot be recovered from the hash.'
			}
		]
	},
	jwt: {
		intro: 'Decode a JSON Web Token to read its header and payload.',
		faqs: [
			{
				q: 'Does decoding verify the token?',
				a: 'No. Decoding only reads the contents. Verifying the signature needs the secret or public key and must be done by your server.'
			},
			{
				q: 'Is it safe to paste a token here?',
				a: 'Decoding happens in your browser, but avoid pasting live production tokens into any online tool.'
			}
		]
	},
	timestamp: {
		intro: 'Convert Unix timestamps to readable dates and dates back to Unix time.',
		faqs: [
			{
				q: 'Seconds or milliseconds?',
				a: 'Unix time counts seconds since 1 January 1970 UTC. JavaScript uses milliseconds, so those values have three more digits.'
			},
			{
				q: 'Which time zone is used?',
				a: 'Results show ISO 8601, UTC and your local time side by side, so there is no ambiguity.'
			}
		]
	},
	number: {
		intro: 'Convert numbers between decimal, binary, octal and hexadecimal bases.',
		faqs: [
			{
				q: 'How do I read a binary number?',
				a: 'Each digit is a power of two, starting from the right. For example 1010 is 8 + 2, which is 10 in decimal.'
			},
			{
				q: 'What input is accepted?',
				a: 'Whole numbers of any size, including negatives, one per line. Underscores are ignored and 0b, 0o and 0x prefixes are accepted.'
			}
		]
	},
	cron: {
		intro: 'Turn a cron expression into a plain English schedule.',
		faqs: [
			{
				q: 'What are the cron fields?',
				a: 'Minute, hour, day of month, month and day of week, in that order, separated by spaces.'
			},
			{
				q: 'What does */5 mean?',
				a: 'It means every 5th unit, so */5 in the minute field runs every five minutes.'
			}
		]
	},
	generate: {
		intro: 'Generate random UUIDs and placeholder Lorem Ipsum text.',
		faqs: [
			{
				q: 'Which UUID version is generated?',
				a: 'Version 4, which is random. Type how many you need (up to 1000) as the input.'
			},
			{
				q: 'Are the values unique?',
				a: 'UUID v4 collisions are astronomically unlikely, so values are safe to treat as unique.'
			}
		]
	}
}

const swap = (slug: string): string | null => {
	const pairs: Array<[string, string]> = [
		['encode', 'decode'],
		['escape', 'unescape']
	]
	for (const [a, b] of pairs) {
		if (slug.endsWith(a) && !slug.endsWith(`un${a}`)) {
			return slug.slice(0, -a.length) + b
		}
		if (slug.endsWith(b)) return slug.slice(0, -b.length) + a
	}
	const m = slug.match(/^(.+)-to-(.+)$/)
	return m ? `${m[2]}-to-${m[1]}` : null
}

const crossTool: Record<string, string> = {
	'json/yaml': 'yaml/json',
	'yaml/json': 'json/yaml',
	'json/csv': 'csv/json',
	'csv/json': 'json/csv',
	'json/xml': 'xml/json',
	'xml/json': 'json/xml',
	'timestamp/from-unix': 'timestamp/to-unix',
	'timestamp/to-unix': 'timestamp/from-unix'
}

/** The "opposite" converter of a translator, when one exists. */
export function inverseOf(tool: Tool, translator: Translator) {
	const key = `${tool.slug}/${translator.slug}`
	const target = crossTool[key]
	if (target) {
		const [t, s] = target.split('/')
		return findTranslator(t, s)
	}
	const swapped = swap(translator.slug)
	return swapped ? findTranslator(tool.slug, swapped) : null
}

/** Links shown under a tool: the inverse converter, then siblings. */
export function relatedTools(tool: Tool, translator: Translator, max = 6) {
	const related: Array<{ tool: Tool; translator: Translator }> = []
	const inverse = inverseOf(tool, translator)
	if (inverse) related.push(inverse)
	for (const sibling of tool.translators) {
		if (related.length >= max) break
		if (sibling.slug === translator.slug) continue
		if (
			inverse &&
			inverse.tool.slug === tool.slug &&
			sibling.slug === inverse.translator.slug
		)
			continue
		related.push({ tool, translator: sibling })
	}
	return related
}
