import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: "**/*.jsx",
  })],
  server: {
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'https://localhost:5001', // Địa chỉ backend .NET Core
        changeOrigin: true,
        secure: false // Dùng cho HTTPS nếu bạn không có chứng chỉ tin cậy
      }
    }
  }
})
