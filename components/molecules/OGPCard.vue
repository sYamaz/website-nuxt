<template>
  <v-card :href="url">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ site_name }}</v-card-subtitle>
    <v-card-text>{{ description }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "nuxt-property-decorator";
import LocalImage from "../atoms/LocalImage.vue";
import CardUrl from "../atoms/CardUrl.vue";

@Component({
  components: {
    LocalImage,
    CardUrl
  }
})
export default class OGPCard extends Vue {
  @Prop({ default: "{url}" })
  private url!: string;

  @Prop({ default: "" })
  private site_name!: string;

  @Prop({ default: null })
  private image!: any;

  @Prop({ default: "" })
  private description!: string;

  @Prop({ default: "article" })
  private type!: string;

  @Prop({ default: "{title}" })
  private title!: string;
}
</script>

<style></style>
