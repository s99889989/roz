<script setup>
const props = defineProps({
  error: Object
})

if (props.error?.statusCode === 404) {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div>
    <template v-if="error?.statusCode !== 404">
      <h1>{{ error?.statusCode }}</h1>
      <p>{{ error?.message }}</p>
      <NuxtLink to="/">回首頁</NuxtLink>
    </template>
  </div>
</template>