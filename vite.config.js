import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: 'src/lite-webapp.mjs',
			formats: ['es']
		},
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html')
			}
		}
	},
	esbuild: {
		supported: {
			'top-level-await': true	// top-level-await feature
		}
	}
})