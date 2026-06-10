import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `app-src` is a symlink → ../Flickflow App/flick-flow-next/src
// Aliasing `@` to it lets us import the REAL design-system (tokens, icons,
// helpers) so generated resources render identically and code is drop-in.
const appSrc = fileURLToPath(new URL('./app-src', import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': appSrc, // mirrors the app's tsconfig path: @/* → src/*
      '~': fileURLToPath(new URL('./src', import.meta.url)), // sandbox-local code
    },
  },
  server: {
    port: 5273,
    fs: {
      // Allow Vite to read files through the symlink (outside project root).
      allow: [
        fileURLToPath(new URL('.', import.meta.url)),
        fileURLToPath(new URL('../Flickflow App/flick-flow-next', import.meta.url)),
      ],
    },
  },
})
