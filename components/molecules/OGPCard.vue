<template>
  <v-card :href="data.url" class="py-2">
    <v-card-title>{{ data.title }}</v-card-title>
    <v-card-subtitle>{{ data.url }}</v-card-subtitle>
    <v-card-text>{{ data.body.slice(0, 140) }}...</v-card-text>
    <v-card-label class="ml-4" v-for="tag in data.tags" :key="tag.name" :name="tag.name" />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'nuxt-property-decorator'
import LocalImage from '~/components/atoms/LocalImage.vue'
import CardUrl from '~/components/atoms/CardUrl.vue'
import VCardLabel from '~/components/atoms/VCardLabel.vue'
import { PostData } from '~/types/Qiita/Api/v2/datas'

@Component({
  components: {
    LocalImage,
    CardUrl,
    VCardLabel
  }
})
export default class OGPCard extends Vue {
  @Prop({ default: {}, required: true })
  private data!:PostData
}
</script>

<style></style>
