<template>
  <v-container>
    <v-row class="">
      <v-col cols="12" sm="2" style="max-width: fit-content;" class="pa-4">
        <v-avatar alt="sYamaz" s size="64">
          <img :src="prop.avatarSrc">
        </v-avatar>
      </v-col>
      <v-col class="" align-self="center">
        <SubContentHeadline :title="prop.headline" />
        <p>{{ prop.description }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import SubContentHeadline from '~/components/atoms/SubContentHeadline.vue'

const prop = defineProps<{headline:string, description:string, avatarSrc:any}>()
</script>
