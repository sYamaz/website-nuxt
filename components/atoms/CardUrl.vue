<template>
  <v-card-text class="text-secondary">
    {{ url }}
  </v-card-text>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'

@Component({})
export default class CardUrl extends Vue {
  @Prop({ default: '{url}' })
    url!:string
}
</script>

<style>

</style>
