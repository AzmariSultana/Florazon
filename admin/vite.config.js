import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // BASE_PATH lets the same build be served from a sub-path such as GitHub Pages (/Florazon/admin/)
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {port : 5175}
})
