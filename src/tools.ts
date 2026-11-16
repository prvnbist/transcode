import { htmlToJsx, htmlToPug } from '#/server/html'
import * as colors from '#/utils/colors'
import * as cron from '#/utils/cron'
import { cssToJs } from '#/utils/css'
import * as encoding from '#/utils/encoding'
import * as formats from '#/utils/formats'
import * as generate from '#/utils/generate'
import * as hash from '#/utils/hash'
import { htmlToAst } from '#/utils/html'
import * as json from '#/utils/json'
import * as jwt from '#/utils/jwt'
import {
	morseToText,
	textToMorse,
	validateMorseToText,
	validateTextToMorse
} from '#/utils/morse'
import * as number from '#/utils/number'
import * as sql from '#/utils/sql'
import * as text from '#/utils/text'
import * as timestamp from '#/utils/timestamp'
import * as url from '#/utils/url'

export type Convert = (input: string) => string | Promise<string>

export type Translator = {
	slug: string
	label: string
	convert: Convert
	/** Returns a warning message, or '' when the input is fine. */
	validate?: (input: string) => string
	inputLanguage?: string
	outputLanguage?: string
}

export type Tool = {
	slug: string
	label: string
	inputLanguage: string
	translators: Array<Translator>
}

export const tools: Array<Tool> = [
	{
		slug: 'text',
		label: 'Text',
		inputLanguage: 'plaintext',
		translators: [
			{
				slug: 'camel-case',
				label: 'Camel Case',
				convert: text.camelCase
			},
			{
				slug: 'kebab-case',
				label: 'Kebab Case',
				convert: text.kebabCase
			},
			{
				slug: 'snake-case',
				label: 'Snake Case',
				convert: text.snakeCase
			},
			{
				slug: 'start-case',
				label: 'Start Case',
				convert: text.startCase
			},
			{
				slug: 'lower-case',
				label: 'Lower Case',
				convert: text.lowerCase
			},
			{
				slug: 'upper-case',
				label: 'Upper Case',
				convert: text.upperCase
			},
			{
				slug: 'capitalize',
				label: 'Capitalize',
				convert: text.capitalize
			},
			{
				slug: 'pascal-case',
				label: 'Pascal Case',
				convert: text.pascalCase
			},
			{
				slug: 'constant-case',
				label: 'Constant Case',
				convert: text.constantCase
			},
			{ slug: 'dot-case', label: 'Dot Case', convert: text.dotCase },
			{ slug: 'slugify', label: 'Slugify', convert: text.slugify },
			{ slug: 'reverse', label: 'Reverse', convert: text.reverse },
			{
				slug: 'sort-lines',
				label: 'Sort Lines',
				convert: text.sortLines
			},
			{
				slug: 'unique-lines',
				label: 'Unique Lines',
				convert: text.uniqueLines
			},
			{
				slug: 'trim-lines',
				label: 'Trim Lines',
				convert: text.trimLines
			},
			{
				slug: 'stats',
				label: 'Stats',
				convert: text.stats,
				outputLanguage: 'json'
			}
		]
	},
	{
		slug: 'url',
		label: 'URL',
		inputLanguage: 'plaintext',
		translators: [
			{ slug: 'encode', label: 'Encode', convert: url.encode },
			{ slug: 'decode', label: 'Decode', convert: url.decode },
			{
				slug: 'parse',
				label: 'Parse',
				convert: url.parse,
				outputLanguage: 'json'
			},
			{
				slug: 'extract-links',
				label: 'Extract Links',
				convert: url.extractLinks,
				outputLanguage: 'json'
			}
		]
	},
	{
		slug: 'html',
		label: 'HTML',
		inputLanguage: 'html',
		translators: [
			{
				slug: 'pug',
				label: 'Pug',
				convert: input => htmlToPug({ data: { input } }),
				outputLanguage: 'pug'
			},
			{
				slug: 'jsx',
				label: 'JSX',
				convert: input => htmlToJsx({ data: { input } }),
				outputLanguage: 'javascript'
			},
			{
				slug: 'ast',
				label: 'AST',
				convert: htmlToAst,
				outputLanguage: 'json'
			}
		]
	},
	{
		slug: 'css',
		label: 'CSS',
		inputLanguage: 'css',
		translators: [
			{
				slug: 'javascript',
				label: 'Javascript',
				convert: cssToJs,
				outputLanguage: 'json'
			}
		]
	},
	{
		slug: 'json',
		label: 'JSON',
		inputLanguage: 'json',
		translators: [
			{
				slug: 'format',
				label: 'Format',
				convert: json.format,
				outputLanguage: 'json'
			},
			{
				slug: 'minify',
				label: 'Minify',
				convert: json.minify,
				outputLanguage: 'json'
			},
			{
				slug: 'csv',
				label: 'CSV',
				convert: json.toCsv
			},
			{
				slug: 'xml',
				label: 'XML',
				convert: json.toXml,
				outputLanguage: 'xml'
			},
			{
				slug: 'yaml',
				label: 'YAML',
				convert: json.toYaml,
				outputLanguage: 'yaml'
			},
			{
				slug: 'mongoose',
				label: 'Mongoose Schema',
				convert: json.toMongoose,
				outputLanguage: 'json'
			},
			{
				slug: 'mysql',
				label: 'MySQL',
				convert: json.toMysql,
				outputLanguage: 'sql'
			},
			{
				slug: 'json-schema',
				label: 'JSON Schema',
				convert: json.toJsonSchema,
				outputLanguage: 'json'
			},
			{
				slug: 'big-query',
				label: 'Big Query',
				convert: json.toBigQuery,
				outputLanguage: 'json'
			},
			{
				slug: 'graphql',
				label: 'GraphQL',
				convert: json.toGraphql,
				outputLanguage: 'graphql'
			},
			{
				slug: 'typescript',
				label: 'TypeScript',
				convert: json.toTypescript,
				outputLanguage: 'typescript'
			},
			{
				slug: 'zod',
				label: 'Zod Schema',
				convert: json.toZod,
				outputLanguage: 'typescript'
			}
		]
	},
	{
		slug: 'yaml',
		label: 'YAML',
		inputLanguage: 'yaml',
		translators: [
			{
				slug: 'json',
				label: 'JSON',
				convert: formats.yamlToJson,
				outputLanguage: 'json'
			}
		]
	},
	{
		slug: 'csv',
		label: 'CSV',
		inputLanguage: 'plaintext',
		translators: [
			{
				slug: 'json',
				label: 'JSON',
				convert: formats.csvToJson,
				outputLanguage: 'json'
			}
		]
	},
	{
		slug: 'xml',
		label: 'XML',
		inputLanguage: 'xml',
		translators: [
			{
				slug: 'json',
				label: 'JSON',
				convert: formats.xmlToJson,
				outputLanguage: 'json'
			},
			{
				slug: 'format',
				label: 'Format',
				convert: formats.xmlFormat,
				outputLanguage: 'xml'
			}
		]
	},
	{
		slug: 'sql',
		label: 'SQL',
		inputLanguage: 'sql',
		translators: [
			{
				slug: 'format',
				label: 'Format',
				convert: sql.format,
				outputLanguage: 'sql'
			},
			{
				slug: 'minify',
				label: 'Minify',
				convert: sql.minify,
				outputLanguage: 'sql'
			}
		]
	},
	{
		slug: 'colors',
		label: 'Colors',
		inputLanguage: 'plaintext',
		translators: [
			{
				slug: 'hex-to-rgb',
				label: 'Hex to RGB',
				convert: colors.hexToRgb
			},
			{
				slug: 'hex-to-cmyk',
				label: 'Hex to CMYK',
				convert: colors.hexToCmyk
			},
			{
				slug: 'hex-to-hsl',
				label: 'Hex to HSL',
				convert: colors.hexToHsl
			},
			{
				slug: 'hex-to-hsv',
				label: 'Hex to HSV',
				convert: colors.hexToHsv
			},
			{
				slug: 'rgb-to-hex',
				label: 'RGB to Hex',
				convert: colors.rgbToHex
			},
			{
				slug: 'rgb-to-cmyk',
				label: 'RGB to CMYK',
				convert: colors.rgbToCmyk
			},
			{
				slug: 'rgb-to-hsl',
				label: 'RGB to HSL',
				convert: colors.rgbToHsl
			},
			{
				slug: 'rgb-to-hsv',
				label: 'RGB to HSV',
				convert: colors.rgbToHsv
			},
			{
				slug: 'keyword-to-hex',
				label: 'Keyword to Hex',
				convert: colors.keywordToHex
			},
			{
				slug: 'keyword-to-rgb',
				label: 'Keyword to RGB',
				convert: colors.keywordToRgb
			}
		]
	},
	{
		slug: 'morse',
		label: 'Morse',
		inputLanguage: 'plaintext',
		translators: [
			{
				slug: 'text-to-morse',
				label: 'Text to Morse',
				convert: textToMorse,
				validate: validateTextToMorse
			},
			{
				slug: 'morse-to-text',
				label: 'Morse to Text',
				convert: morseToText,
				validate: validateMorseToText
			}
		]
	},
	{
		slug: 'encoding',
		label: 'Encoding',
		inputLanguage: 'plaintext',
		translators: [
			{
				slug: 'base64-encode',
				label: 'Base64 Encode',
				convert: encoding.base64Encode
			},
			{
				slug: 'base64-decode',
				label: 'Base64 Decode',
				convert: encoding.base64Decode
			},
			{
				slug: 'hex-encode',
				label: 'Hex Encode',
				convert: encoding.hexEncode
			},
			{
				slug: 'hex-decode',
				label: 'Hex Decode',
				convert: encoding.hexDecode
			},
			{
				slug: 'binary-encode',
				label: 'Binary Encode',
				convert: encoding.binaryEncode
			},
			{
				slug: 'binary-decode',
				label: 'Binary Decode',
				convert: encoding.binaryDecode
			},
			{
				slug: 'html-escape',
				label: 'HTML Escape',
				convert: encoding.htmlEscape
			},
			{
				slug: 'html-unescape',
				label: 'HTML Unescape',
				convert: encoding.htmlUnescape
			},
			{
				slug: 'unicode-escape',
				label: 'Unicode Escape',
				convert: encoding.unicodeEscape
			},
			{
				slug: 'unicode-unescape',
				label: 'Unicode Unescape',
				convert: encoding.unicodeUnescape
			},
			{ slug: 'rot13', label: 'ROT13', convert: encoding.rot13 }
		]
	},
	{
		slug: 'hash',
		label: 'Hash',
		inputLanguage: 'plaintext',
		translators: [
			{ slug: 'md5', label: 'MD5', convert: hash.md5 },
			{ slug: 'sha1', label: 'SHA-1', convert: hash.sha1 },
			{ slug: 'sha256', label: 'SHA-256', convert: hash.sha256 },
			{ slug: 'sha512', label: 'SHA-512', convert: hash.sha512 }
		]
	},
	{
		slug: 'jwt',
		label: 'JWT',
		inputLanguage: 'plaintext',
		translators: [
			{
				slug: 'decode',
				label: 'Decode',
				convert: input => jwt.decode(input),
				validate: jwt.validate,
				outputLanguage: 'json'
			}
		]
	},
	{
		slug: 'timestamp',
		label: 'Timestamp',
		inputLanguage: 'plaintext',
		translators: [
			{
				slug: 'from-unix',
				label: 'Unix to Date',
				convert: input => timestamp.fromUnix(input),
				outputLanguage: 'json'
			},
			{
				slug: 'to-unix',
				label: 'Date to Unix',
				convert: input => timestamp.toUnix(input),
				outputLanguage: 'json'
			}
		]
	},
	{
		slug: 'number',
		label: 'Number',
		inputLanguage: 'plaintext',
		translators: [
			{
				slug: 'decimal-to-binary',
				label: 'Decimal to Binary',
				convert: number.decimalToBinary
			},
			{
				slug: 'decimal-to-octal',
				label: 'Decimal to Octal',
				convert: number.decimalToOctal
			},
			{
				slug: 'decimal-to-hex',
				label: 'Decimal to Hex',
				convert: number.decimalToHex
			},
			{
				slug: 'binary-to-decimal',
				label: 'Binary to Decimal',
				convert: number.binaryToDecimal
			},
			{
				slug: 'octal-to-decimal',
				label: 'Octal to Decimal',
				convert: number.octalToDecimal
			},
			{
				slug: 'hex-to-decimal',
				label: 'Hex to Decimal',
				convert: number.hexToDecimal
			},
			{
				slug: 'bytes-to-human',
				label: 'Bytes to Human',
				convert: number.bytesToHuman
			}
		]
	},
	{
		slug: 'cron',
		label: 'Cron',
		inputLanguage: 'plaintext',
		translators: [
			{
				slug: 'describe',
				label: 'Describe',
				convert: cron.describe,
				validate: cron.validate
			}
		]
	},
	{
		slug: 'generate',
		label: 'Generate',
		inputLanguage: 'plaintext',
		translators: [
			{ slug: 'uuid', label: 'UUID (count)', convert: generate.uuid },
			{
				slug: 'lorem',
				label: 'Lorem Ipsum (paragraphs)',
				convert: generate.lorem
			}
		]
	}
]

export const findTranslator = (toolSlug: string, translatorSlug: string) => {
	const tool = tools.find(t => t.slug === toolSlug)
	const translator = tool?.translators.find(t => t.slug === translatorSlug)
	return tool && translator ? { tool, translator } : null
}
