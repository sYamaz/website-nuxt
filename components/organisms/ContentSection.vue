<template>
  <v-container class="pa-0">
    <SectionHeadline :title="title" />
    <v-container class="mx-4">
      <slot />
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import SectionHeadline from '../atoms/SectionHeadline.vue'

@Component({
  components: {
    SectionHeadline
  }
})
export default class ContentSection extends Vue {
  @Prop({ default: 'Section title' })
  private title!: string
}
</script>
