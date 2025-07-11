// vitest.config.ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from "path"
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    tanstackRouter(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              runtime: 'automatic',
            },
          ],
        ],
      },
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
  define: {
    global: 'globalThis',
  },
  test: {
    environment: 'happy-dom', // hoặc 'jsdom'
    globals: true,        // Cho phép dùng các biến global như `describe`, `it`... không cần import
    setupFiles: ['./src/test/setupTests.ts'], // Nếu bạn có file setup test global (ví dụ mock các module)
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    }
  },
  server: {
    open: false,
    port: 5173
  }
})
