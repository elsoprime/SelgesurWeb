// @ts-check
import {defineConfig} from 'astro/config'
import tailwind from '@tailwindcss/vite'

import netlify from '@astrojs/netlify'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwind()]
  },

  image: {
    domains: ['selgesur-home.local', 'selgesur.cl/wordpress']
  },

  // Configuración de variables de entorno
  env: {
    schema: {
      PUBLIC_API_BASE_URL: {
        context: 'client',
        access: 'public',
        type: 'string'
      },
      PUBLIC_API_TIMEOUT: {
        context: 'client',
        access: 'public',
        type: 'number',
        default: 10000
      },
      PUBLIC_API_RETRY_ATTEMPTS: {
        context: 'client',
        access: 'public',
        type: 'number',
        default: 3
      }
    }
  },

  adapter: netlify()
})
