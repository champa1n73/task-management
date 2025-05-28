/// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,             // Optional: use global test APIs like jest
    environment: 'jsdom',      // For DOM testing (React components)
    setupFiles: './src/setupTests.js', // Optional, for jest-dom or global setup
  },
})
