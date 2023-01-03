<template>
  <v-img :src="prop.img" />
</template>

<script lang="ts" setup>

const prop = defineProps<{img: any}>()

</script>
