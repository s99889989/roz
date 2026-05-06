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

})
