<template>
  <v-list style="padding:0px">
    <v-list-item v-for="data in datas" :key="data.name" class="pa-0">
      <LinkButton :link-data="data" />
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import LinkButton, { LinkData } from '../atoms/LinkButton.vue'

@Component({
  components: {
    LinkButton
  }
})
export default class LinkButtonStack extends Vue {
    @Prop({
      default: [
        {
          icon: '',
          name: 'A',
          url: ''
        },
        {
          icon: '',
          name: 'BBBB',
          url: ''
        }
      ]
    })
  private datas!:LinkData[]
}
</script>
