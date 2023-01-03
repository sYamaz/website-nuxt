<template>
  <v-chip class="capitalization_none" disabled small>
    {{ prop.name }}
  </v-chip>
</template>

<script lang="ts" setup>
const prop = defineProps<{name:string}>()

</script>

<style lang="scss">
.capitalization_none{
  text-transform: none;
}
</style>
