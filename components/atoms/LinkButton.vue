<template>
  <v-btn elevation="0" class="info--text" :href="linkData.url" text>
    {{ linkData.name }} <v-icon v-if="linkData.icon != ''">
      {{ linkData.icon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

export interface LinkData{
    icon:any
    name:string
    url:string
}

@Component
export default class LinkButton extends Vue {
    @Prop({
      default: [
        {
          icon: '',
          name: 'displayName',
          url: 'url'
        }
      ]
    })
      linkData!: LinkData
}
</script>
