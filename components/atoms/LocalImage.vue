<template>
  <v-img :src="img" />
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'

@Component({})
export default class LocalImage extends Vue {
  @Prop({ default: null })
    img! :any
}
</script>
