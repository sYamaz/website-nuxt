<template>
  <v-btn elevation="0" class="info--text" :href="prop.linkData.url" text>
    {{ prop.linkData.name }} <v-icon v-if="prop.linkData.icon != ''">
      {{ prop.linkData.icon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts" setup>

export interface LinkData{
    icon:any
    name:string
    url:string
}

const prop = defineProps<{linkData:LinkData}>()
</script>
