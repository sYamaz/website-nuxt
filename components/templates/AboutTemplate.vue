<template>
  <v-card elevation="1" class="pa-6">
    <PageHeadline :title="prop.data.pageTitle" />
    <AvatarDescriptionSection
      :avatar-src="prop.data.introAvatar"
      :headline="prop.data.introHeadline"
      :description="prop.data.introDescription"
    />

    <!--Biography-->
    <ContentSection :title="prop.data.bioTitle">
      <TwoColomnsTable :records="prop.data.bioRecords" />
    </ContentSection>
    <!--Hobby-->
    <ContentSection :title="prop.data.hobbyTitle">
      <JoinedText :text-array="prop.data.hobbyItems" />
    </ContentSection>
    <!--Web-->
    <ContentSection :title="prop.data.webTitle">
      <LinkButtonStack :datas="prop.data.webLinks" />
    </ContentSection>
  </v-card>
</template>

<script lang="ts" setup>
import LinkButtonStack from '../molecules/LinkButtonStack.vue'
import { LinkData } from '../atoms/LinkButton.vue'
import PageHeadline from '~/components/atoms/PageHeadline.vue'
import AvatarDescriptionSection from '~/components/organisms/AvatarDescriptionSection.vue'
import ContentSection from '~/components/organisms/ContentSection.vue'
import TwoColomnsTable, { TwoColomnsRecord } from '~/components/atoms/TwoColomnsTable.vue'
import JoinedText from '~/components/atoms/JoinedText.vue'

export interface AboutTemplateData {
  pageTitle: string
  introAvatar: any
  introHeadline: string
  introDescription: string

  bioTitle: string,
  bioRecords: TwoColomnsRecord[]

  hobbyTitle: string,
  hobbyItems: string[]

  webTitle: string
  webLinks: LinkData[]
}

const prop = defineProps<{data: AboutTemplateData}>()

</script>
