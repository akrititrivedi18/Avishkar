// Vite ka basic config file — isme react plugin add kiya hai
// taaki .jsx files samajh me aaye aur fast dev-server chale.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
