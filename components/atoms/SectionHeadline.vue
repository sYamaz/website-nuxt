<template>
  <h2>{{ title }}</h2>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class SectionHeadline extends Vue {
    @Prop({ default: 'title' })
  private title!:string
}
</script>
