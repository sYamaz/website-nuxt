<template>
  <v-card :href="prop.data.url" class="py-2">
    <v-card-title>{{ prop.data.title }}</v-card-title>
    <v-card-subtitle>{{ prop.data.url }}</v-card-subtitle>
    <v-card-text>{{ prop.data.body.slice(0, 140) }}...</v-card-text>
    <v-card-label v-for="tag in prop.data.tags" :key="tag.name" class="ml-4" :name="tag.name" />
  </v-card>
</template>

<script lang="ts" setup>
import { PostData } from '~/types/Qiita/Api/v2/datas'
import VCardLabel from '~/components/atoms/VCardLabel.vue'

const prop = defineProps<{data:PostData}>()
</script>

<style></style>
