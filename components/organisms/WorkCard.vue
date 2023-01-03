<template>
  <v-card>
    <v-card-title>{{ prop.work.name }}</v-card-title>
    <v-card-media>
      <v-img :src="prop.work.img" />
    </v-card-media>
    <v-card-text>{{ prop.work.text }}</v-card-text>
    <v-card-subtitle>Platform: {{ prop.work.platform.join(", ") }}</v-card-subtitle>
    <v-card-subtitle>Status: {{ prop.work.status }}</v-card-subtitle>
    <v-divider />
    <v-card-actions>
      <LinkButton v-if="prop.work.url !== ''" :link-data="{icon:'', name:prop.work.buttonName, url:prop.work.url}" />
      <LinkButton v-if="prop.work.outerurl !== ''" :link-data="{icon:'', name:prop.work.buttonName, url:prop.work.outerurl}" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import LinkButton from '../atoms/LinkButton.vue'

export interface Work{
  name:string,
  img:any,
  text:string,
  platform:string[],
  status:string,
  url:string,
  outerurl:string,
  buttonName:string
}

const prop = defineProps<{work: Work}>()

</script>
