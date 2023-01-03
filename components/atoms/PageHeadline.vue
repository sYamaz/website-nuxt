<template>
  <h1>{{ prop.title }}</h1>
</template>

<script lang="ts" setup>

const prop = defineProps<{title:string}>()

</script>
