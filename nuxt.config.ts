// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/input.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=500, initial-scale=1',
      title: 'RO樂園',
      meta: [
        { name: 'description', content: 'RO樂園' },
        { name: 'og:title', content: 'RO樂園' },
        { name: 'og:description', content: 'RO樂園' },
        { name: 'og:image', content: '/logo.ico' },
      ],
      link: [

      ],
      script: [

      ]
    }
  }
})
