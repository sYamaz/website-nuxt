<template>
  <p>
    {{ textArray.join(', ') }}
  </p>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'

@Component
export default class JoinedText extends Vue {
    @Prop({ default: ['A', 'B'] })
      textArray!:string[]
}
</script>
