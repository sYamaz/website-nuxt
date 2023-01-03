<template>
  <v-container class="pa-0">
    <SectionHeadline :title="prop.title" />
    <v-container class="mx-4">
      <slot />
    </v-container>
  </v-container>
</template>

<script lang="ts" setup>
import SectionHeadline from '../atoms/SectionHeadline.vue'

const prop = defineProps<{title:string}>()
</script>
