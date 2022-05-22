<template>
  <p>
    {{ textArray.join(', ') }}
  </p>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class JoinedText extends Vue {
    @Prop({ default: ['A', 'B'] })
  private textArray!:string[]
}
</script>
