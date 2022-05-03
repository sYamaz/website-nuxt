<template>
  <h3>{{title}}</h3>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class SubContentHeadline extends Vue{
  @Prop({default: 'title'})
  private title!:string
}

</script>