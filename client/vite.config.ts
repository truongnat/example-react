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
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  define: {
    global: 'globalThis',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      '@tanstack/react-router',
      'socket.io-client'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        // Only split vendor from app code - simple and effective
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    // Increase warning limit - accept larger chunks for better performance
    chunkSizeWarningLimit: 1000,
    // Optimize minification
    minify: 'esbuild',
    // Source maps for production debugging (optional)
    sourcemap: false,
    // Optimize CSS
    cssMinify: true,
    // Enable tree shaking
    target: 'esnext'
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
