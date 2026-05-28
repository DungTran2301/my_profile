import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'book-diary/landing/index': resolve(__dirname, 'book-diary/landing/index.html'),
      },
    },
  },
})
