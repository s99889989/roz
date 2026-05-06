
<script setup>
import { onMounted } from 'vue'
import { useFlowbite } from '~/composables/useFlowbite';
import {initFlowbite} from "flowbite";
import Navbar from "./pages/navbar.vue";
// import RozSidebar from "~/layouts/RozSidebar.vue";
useHead({
  charset: 'utf-8',
  viewport: 'width=500, initial-scale=1',
  title: 'RO 樂園資訊站',
  htmlAttrs: {
    lang: 'tw'
  },
  meta: [
    // { name: 'description', content: 'RO樂園' },
    // { name: 'og:title', content: 'RO樂園' },
    // { name: 'og:description', content: '資料查詢站' },
    // { name: 'og:image', content: '/images/og_image.jpg' },
  ],
  link: [
    {
      href: "vue-virtual-scroller/dist/vue-virtual-scroller.css",
      rel: "stylesheet"
    },
    { rel: 'icon', href: '/logo.png' }
  ],
  script: [
    { src: "vue.js" },
    { src: "vue-virtual-scroller/dist/vue-virtual-scroller.min.js" },
  ]
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