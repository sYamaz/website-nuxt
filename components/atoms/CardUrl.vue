<template>
  <v-card-text class="text-secondary">
    {{ prop.url }}
  </v-card-text>
</template>

<script lang="ts" setup>
const prop = defineProps<{url: string}>()
</script>

<style>

</style>
