import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Forces Vite to bypass Rolldown's native engine minifier and use rock-solid esbuild instead
    minify: 'esbuild',
    // Generates source maps so Vercel can display hidden errors if any syntax breaks
    sourcemap: true
  }
})
