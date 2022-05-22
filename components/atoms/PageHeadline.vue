<template>
  <h1>{{ title }}</h1>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'

@Component
export default class PageHeadline extends Vue {
  @Prop({ default: 'title' })
  private title!:string
}

</script>
