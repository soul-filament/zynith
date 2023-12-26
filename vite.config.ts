import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { localServerConfig } from './src/api/vite-connection'

export default defineConfig({
  plugins: [
    react(),
    localServerConfig
  ],
  server: {
    open: true,
  },
  build: {
    outDir: 'lib/web',
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      }
    },
  },
})
