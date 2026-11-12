import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Ativa o plugin do React durante a execução do Vite.
export default defineConfig({
  plugins: [react()],
})
