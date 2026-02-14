import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Относительный base — работает при любом имени репозитория на GitHub Pages
  base: './',
})
