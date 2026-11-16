## Transcode

An online toolbox for transcoding text: case transforms, URL, HTML, CSS, JSON, colors, and Morse.

**Demo**: https://transcode.prvnbist.com

**Built with**: [TanStack Start](https://tanstack.com/start) (with [Nitro](https://nitro.build) server functions), React 19, Tailwind CSS 4, [Vite+](https://viteplus.dev), deployed on Vercel.

### API

Every converter page `/{tool}/{translator}` is also available as `/api/{tool}/{translator}`. `GET /api` lists all endpoints. CORS is open, input is capped at 100 KB, and nothing is stored.

```bash
# JSON in, JSON out
curl -X POST https://transcode.prvnbist.com/api/json/yaml \
  -H 'content-type: application/json' -d '{"input":"{\"a\":1}"}'
# => { "tool": "json", "translator": "yaml", "output": "a: 1\n" }

# Raw text in, plain text out
curl -X POST https://transcode.prvnbist.com/api/text/camel-case \
  -H 'accept: text/plain' -d 'hello world'

# Short inputs via GET
curl 'https://transcode.prvnbist.com/api/encoding/base64-encode?input=hello&format=text'
```

An LLM-friendly guide to every endpoint is served at [`/LLM.md`](https://transcode.prvnbist.com/LLM.md), generated from the tool registry.

Status codes: `200` ok, `400` bad request, `404` unknown converter, `413` input too large, `422` the converter rejected the input (`error` holds the message). A non-fatal `warning` may accompany a 200.

### MCP

Transcode also runs as a remote [MCP](https://modelcontextprotocol.io) server (Streamable HTTP, stateless) at `/mcp`, exposing `list_converters` and `convert`.

```bash
claude mcp add --transport http transcode https://transcode.prvnbist.com/mcp
```

### Development

```bash
pnpm install
pnpm dev      # dev server on :3000
pnpm check    # format, lint, typecheck
pnpm test
pnpm build    # server output in .output
```

### Roadmap

- [x] Text: camel, kebab, snake, start, lower, upper case, capitalize
- [x] URL: encode, decode, parse, extract links
- [x] HTML: to Pug, JSX, AST
- [x] CSS: to JavaScript object
- [x] JSON: to YAML, Mongoose, MySQL, JSON Schema, BigQuery, GraphQL
- [x] Colors: hex / rgb / keyword conversions
- [x] Morse: text to morse, morse to text
