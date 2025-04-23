// vitest.config.ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // hoặc '@vitejs/plugin-react' nếu bạn không dùng SWC
import tsconfigPaths from 'vite-tsconfig-paths' // Nếu bạn dùng path aliases
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'


export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(), 
    tsconfigPaths(),
    tailwindcss(),
  ],
  test: {
    environment: 'happy-dom', // hoặc 'jsdom'
    globals: true,        // Cho phép dùng các biến global như `describe`, `it`... không cần import
    setupFiles: ['./src/test/setupTests.ts'], // Nếu bạn có file setup test global (ví dụ mock các module)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    open: false,
    port: 3000
  }
})
