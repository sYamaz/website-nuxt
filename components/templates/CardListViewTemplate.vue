<template>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
          <PageHeadline :title="data.pageTitle" />
          <v-container>
              <WorkCard class="my-4" v-for="work in data.works" :key="work" :work="work"></WorkCard>
          </v-container>
      </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import WorkCard, { Work } from "~/components/organisms/WorkCard.vue";
import PageHeadline from "~/components/atoms/PageHeadline.vue";
import { Prop } from "vue-property-decorator";

export interface CardListViewTemplateData{
    pageTitle:string
    works: Work[]
}

@Component({
    components:{
        PageHeadline,
        WorkCard
    }
})
export default class CardListViewTemplate extends Vue {
    @Prop({default:{}})
    private data!:CardListViewTemplateData
}
</script>

<style>

</style>