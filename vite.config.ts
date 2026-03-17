import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: [
      '@tanstack/react-query',
      '@tanstack/react-query-devtools',
      '@tanstack/react-form',
      '@tanstack/react-table',
      '@tanstack/react-virtual',
      '@tanstack/react-store',
      '@tanstack/store',
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart({ srcDirectory: 'src' }),
    viteReact(),
    nitro({ preset: 'vercel' }),
  ],
})
