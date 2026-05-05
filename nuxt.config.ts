// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@pinia/nuxt'
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/input.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  runtimeConfig: {
    public: {
      googleClientId: '441605672654-9j73r51g6j2mar17ptblhskfvard1em9.apps.googleusercontent.com', // .env: NUXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=500, initial-scale=1',
      title: 'RO 樂園資訊',
      htmlAttrs: {
        lang: 'tw'
      },
      meta: [
        { name: 'description', content: 'RO樂園' },
        { name: 'og:title', content: 'RO樂園' },
        { name: 'og:description', content: '資料查詢站' },
        { name: 'og:image', content: '/logo.ico' },
        { name: 'twitter:image', content: '/images/og_image.jpg' },
      ],
      link: [
        {
          href: "vue-virtual-scroller/dist/vue-virtual-scroller.css",
          rel: "stylesheet"
        },
      ],
      script: [
        {
          src: "vue.js",
        },
        {
          src: "vue-virtual-scroller/dist/vue-virtual-scroller.min.js",
        },
      ]
    }
  }
})
