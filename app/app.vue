<!--<template>-->
<!--  <div>-->
<!--    <NuxtRouteAnnouncer />-->
<!--    <NuxtWelcome />-->
<!--  </div>-->
<!--</template>-->
<script setup>
import { onMounted } from 'vue'
import { useFlowbite } from '~/composables/useFlowbite';
import {initFlowbite} from "flowbite";
import Navbar from "./pages/navbar.vue";

// initialize components based on data attribute selectors
onMounted(() => {
  useFlowbite(() => {
    initFlowbite();
  })
})

</script>
<template>
  <bg id="main" class="flex container-top flex-col items-center justify-center">
    <NuxtLayout>
<!--      <Navbar />-->
      <NuxtPage />
    </NuxtLayout>
  </bg>
</template>
<style scoped>
bg {
  background: #4b3621;
  color: #fff;
  font-family: 'Microsoft JhengHei', sans-serif;
  text-align: center;
  padding: 30px;
  min-height: 100vh;
}

</style>