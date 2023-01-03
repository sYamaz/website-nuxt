<template>
  <h3>{{ prop.title }}</h3>
</template>

<script lang="ts" setup>
const prop = defineProps<{title: string}>()
</script>
