
<script setup>
import { onMounted } from 'vue'
import { useFlowbite } from '~/composables/useFlowbite';
import {initFlowbite} from "flowbite";
import Navbar from "./pages/navbar.vue";
import RozSidebar from "~/layouts/RozSidebar.vue";

// useHead({
//   meta: [
//     { name: 'viewport', content: 'width=device-width, initial-scale=1' }
//   ],
//   link: [
//     { rel: 'icon', href: '/logo.png' }
//   ],
//   htmlAttrs: {
//     lang: 'tw'
//   }
// })
//
// const title = 'RO樂園'
// const description = ''

useSeoMeta({
  // title,
  // description,
  // ogTitle: title,
  // ogDescription: description,
  //ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  //twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  //twitterCard: 'summary_large_image'
})


// initialize components based on data attribute selectors
onMounted(() => {
  useFlowbite(() => {
    initFlowbite();
  })
})

</script>
<template>
  <RozSidebar />
  <Navbar />
  <bg id="main" class="flex w-full container-top flex-col items-center justify-center">
    <div class="w-full 2xl:w-3/4">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </bg>
</template>
<style scoped>
bg {
  background: #43321c;
  color: #fff;
  font-family: 'Microsoft JhengHei', sans-serif;
  text-align: center;
  padding: 30px;
  min-height: 100vh;
}

</style>