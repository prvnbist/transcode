import { defineConfig } from 'vite-plus'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		tailwindcss(),
		tanstackStart(),
		// Nitro changes dependency resolution, which breaks the test runner
		...(process.env.VITEST ? [] : [nitro()]),
		viteReact()
	],
	fmt: {
		useTabs: true,
		tabWidth: 4,
		semi: false,
		singleQuote: true,
		trailingComma: 'none',
		arrowParens: 'avoid',
		printWidth: 80,
		ignorePatterns: [
			'src/routeTree.gen.ts',
			'pnpm-lock.yaml',
			'dist',
			'.output',
			'src/theme/dark.json'
		]
	},
	lint: { ignorePatterns: ['src/routeTree.gen.ts', 'dist', '.output'] }
})
