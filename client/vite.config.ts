// vitest.config.ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from "path"
import { fileURLToPath } from 'node:url'
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
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/routeTree.gen.ts',
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    }
  },
  server: {
    open: false,
    port: parseInt(process.env.VITE_CLIENT_PORT || '5173'),
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.VITE_SERVER_PORT || '8080'}`,
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxying for Socket.IO
      },
      '/uploads': {
        target: `http://localhost:${process.env.VITE_SERVER_PORT || '8080'}`,
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: `http://localhost:${process.env.VITE_SERVER_PORT || '8080'}`,
        changeOrigin: true,
        secure: false,
        ws: true, // WebSocket support for Socket.IO
      }
    }
  }
})
