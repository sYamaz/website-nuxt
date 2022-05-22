<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <PageHeadline :title="data.pageTitle" />
      <v-container>
        <WorkCard v-for="work in data.works" :key="work.name" class="my-4" :work="work" />
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import WorkCard, { Work } from '~/components/organisms/WorkCard.vue'
import PageHeadline from '~/components/atoms/PageHeadline.vue'

export interface CardListViewTemplateData{
    pageTitle:string
    works: Work[]
}

@Component({
  components: {
    PageHeadline,
    WorkCard
  }
})
export default class CardListViewTemplate extends Vue {
    @Prop({ default: {} })
  private data!:CardListViewTemplateData
}
</script>

<style>

</style>
