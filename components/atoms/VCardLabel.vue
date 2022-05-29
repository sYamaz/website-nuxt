<template>
  <v-chip class="capitalization_none" disabled>
    {{ name }}
  </v-chip>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'

@Component({})
export default class VCardLabel extends Vue {
  @Prop({ default: 'name' })
  private name!: string
}
</script>

<style lang="scss">
.capitalization_none{
  text-transform: none;
}
</style>
