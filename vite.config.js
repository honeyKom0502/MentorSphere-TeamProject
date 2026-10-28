import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Listen on the local network too, so a second laptop can open http://<this-laptop-ip>:5173
  server: { host: true },
})
