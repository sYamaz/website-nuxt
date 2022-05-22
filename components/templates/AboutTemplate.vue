<template>
  <v-card elevation="1" class="pa-6">
    <PageHeadline :title="data.pageTitle" />
    <AvatarDescriptionSection
      :avatar-src="data.introAvatar"
      :headline="data.introHeadline"
      :description="data.introDescription"
    />

    <!--Biography-->
    <ContentSection :title="data.bioTitle">
      <TwoColomnsTable :records="data.bioRecords" />
    </ContentSection>
    <!--Hobby-->
    <ContentSection :title="data.hobbyTitle">
      <JoinedText :text-array="data.hobbyItems" />
    </ContentSection>
    <!--Web-->
    <ContentSection :title="data.webTitle">
      <LinkButtonStack :datas="data.webLinks" />
    </ContentSection>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'nuxt-property-decorator'
import LinkButtonStack from '../molecules/LinkButtonStack.vue'
import { LinkData } from '../atoms/LinkButton.vue'
import PageHeadline from '~/components/atoms/PageHeadline.vue'
import AvatarDescriptionSection from '~/components/organisms/AvatarDescriptionSection.vue'
import ContentSection from '~/components/organisms/ContentSection.vue'
import TwoColomnsTable, { TwoColomnsRecord } from '~/components/atoms/TwoColomnsTable.vue'
import JoinedText from '~/components/atoms/JoinedText.vue'

export interface AboutTemplateData{
    pageTitle:string
    introAvatar:any
    introHeadline:string
    introDescription:string

    bioTitle:string,
    bioRecords:TwoColomnsRecord[]

    hobbyTitle:string,
    hobbyItems:string[]

    webTitle:string
    webLinks: LinkData[]
}

@Component({
  components: {
    PageHeadline,
    AvatarDescriptionSection,
    ContentSection,
    TwoColomnsTable,
    JoinedText,
    LinkButtonStack
  }
})
export default class AboutTemplate extends Vue {
    @Prop({
      default: {

      }
    })
  private data!:AboutTemplateData
}
</script>
