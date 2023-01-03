<template>
  <p>
    {{ prop.textArray.join(', ') }}
  </p>
</template>

<script lang="ts" setup>

const prop = defineProps<{textArray: string[]}>()
</script>
