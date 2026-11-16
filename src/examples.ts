/**
 * Sample input for every converter. Keys are `tool` (shared by all of the
 * tool's translators) or `tool/translator` (overrides the tool default).
 */
const json = `{
    "id": 42,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "active": true,
    "score": 98.5,
    "tags": ["math", "computing"],
    "address": {
        "city": "London",
        "zip": "W1"
    }
}`

const examples: Record<string, string> = {
	// Text
	text: 'The quick brown fox jumps over the lazy dog',
	'text/slugify': 'Crème Brûlée: 10 Easy Recipes!',
	'text/reverse': 'Hello, World! 👋',
	'text/sort-lines': 'banana\nApple\ncherry\nitem 10\nitem 2\napple',
	'text/unique-lines': 'red\ngreen\nred\nblue\ngreen\nred',
	'text/trim-lines': '   first line   \n\n\tsecond line\n   \nthird line  ',
	'text/stats':
		'Transcode converts things.\nIt runs in your browser.\n\nThis is a second paragraph with a café ☕.',

	// URL
	'url/encode': 'https://example.com/search?q=hello world&lang=en-US#top',
	'url/decode':
		'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Den-US',
	'url/parse':
		'https://user:pass@sub.example.com:8080/path/to/page?query=hello&sort=asc#section',
	'url/extract-links':
		'Read the docs at https://example.com/docs and the blog at example.org/blog.\nMirror: http://mirror.example.net/files?id=7',

	// HTML
	html: `<div class="card" id="profile">
    <img src="/avatar.png" alt="Avatar">
    <h2>Ada Lovelace</h2>
    <p>First <strong>programmer</strong>.</p>
    <a href="https://example.com" target="_blank">Website</a>
</div>`,

	// CSS
	css: `.button {
    display: inline-flex;
    padding: 8px 16px;
    background-color: #5e6ad2;
    border-radius: 6px;
}

.button:hover {
    background-color: #4c57c0;
}`,

	// JSON
	json,
	'json/format':
		'{"id":42,"name":"Ada Lovelace","tags":["math","computing"],"address":{"city":"London"}}',
	'json/csv': `[
    { "id": 1, "name": "Ada Lovelace", "role": "Engineer", "active": true },
    { "id": 2, "name": "Alan Turing", "role": "Scientist", "active": false },
    { "id": 3, "name": "Grace Hopper", "role": "Admiral, Engineer", "active": true }
]`,

	// YAML / CSV / XML
	yaml: `name: transcode
version: 1.0.0
private: true
scripts:
  dev: vite
  build: vite build
keywords:
  - converter
  - tools`,
	csv: `id,name,role,active
1,Ada Lovelace,Engineer,true
2,Alan Turing,Scientist,false
3,Grace Hopper,"Admiral, Engineer",true`,
	xml: `<?xml version="1.0" encoding="UTF-8"?>
<library><book id="1" available="true"><title>Dune</title><author>Frank Herbert</author><year>1965</year></book><book id="2" available="false"><title>Neuromancer</title><author>William Gibson</author><year>1984</year></book></library>`,

	// SQL
	sql: `select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.active = true and u.name <> 'O''Brien' group by u.id, u.name order by orders desc limit 10;`,
	'sql/minify': `-- Active users with order counts
SELECT
    u.id,
    u.name,
    COUNT(o.id) AS orders
FROM
    users u
    LEFT JOIN orders o ON o.user_id = u.id /* join on owner */
WHERE
    u.note = 'keep   these   spaces'
GROUP BY
    u.id,
    u.name;`,

	// Colors
	'colors/hex-to-rgb': '#5e6ad2',
	'colors/hex-to-cmyk': '#5e6ad2',
	'colors/hex-to-hsl': '#5e6ad2',
	'colors/hex-to-hsv': '#5e6ad2',
	'colors/rgb-to-hex': '94, 106, 210',
	'colors/rgb-to-cmyk': '94, 106, 210',
	'colors/rgb-to-hsl': '94, 106, 210',
	'colors/rgb-to-hsv': '94, 106, 210',
	'colors/keyword-to-hex': 'rebeccapurple',
	'colors/keyword-to-rgb': 'rebeccapurple',

	// Morse
	'morse/text-to-morse': 'Hello World',
	'morse/morse-to-text': '.... . .-.. .-.. --- / .-- --- .-. .-.. -..',

	// Encoding
	'encoding/base64-encode': 'Hello, World! ✓',
	'encoding/base64-decode': 'SGVsbG8sIFdvcmxkISDinJM=',
	'encoding/hex-encode': 'Hello',
	'encoding/hex-decode': '48 65 6c 6c 6f',
	'encoding/binary-encode': 'Hi!',
	'encoding/binary-decode': '01001000 01101001 00100001',
	'encoding/html-escape': '<a href="/search?q=tom&jerry">Tom & Jerry\'s</a>',
	'encoding/html-unescape':
		'&lt;p&gt;Fish &amp; Chips &copy; 2026 &#x2713;&lt;/p&gt;',
	'encoding/unicode-escape': 'café ☕ 😀',
	'encoding/unicode-unescape': 'caf\\u00e9 \\u2615 \\ud83d\\ude00',
	'encoding/rot13': 'Hello, World!',

	// Hash
	hash: 'The quick brown fox jumps over the lazy dog',

	// JWT
	jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',

	// Timestamp
	'timestamp/from-unix': '1700000000',
	'timestamp/to-unix': '2026-01-15T09:30:00Z',

	// Number
	'number/decimal-to-binary': '42\n255\n1024',
	'number/decimal-to-octal': '8\n64\n511',
	'number/decimal-to-hex': '255\n4096\n18446744073709551615',
	'number/binary-to-decimal': '0b101010\n1111_1111',
	'number/octal-to-decimal': '0o755\n644',
	'number/hex-to-decimal': '0xFF\ndeadbeef',
	'number/bytes-to-human': '512\n1536\n1048576\n5368709120',

	// Cron
	cron: '*/15 9-17 * * 1-5',

	// Generate
	'generate/uuid': '5',
	'generate/lorem': '3'
}

export const getExample = (tool: string, translator: string) =>
	examples[`${tool}/${translator}`] ?? examples[tool] ?? ''
