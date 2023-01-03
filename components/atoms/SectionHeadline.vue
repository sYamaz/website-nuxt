<template>
  <h2>{{ prop.title }}</h2>
</template>

<script lang="ts" setup>
const prop = defineProps<{title:string}>()
</script>
