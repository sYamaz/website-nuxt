<template>
  <ContentSection title="Posts">
    <OGPCard v-for="post in data.posts" :key="post.id" class="ma-4" :data="post" />
  </ContentSection>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { PostData } from '~/types/Qiita/Api/v2/datas'
import OGPCard from '~/components/molecules/OGPCard.vue'
import ContentSection from '~/components/organisms/ContentSection.vue'

export interface PostListTemplateData {
  posts: PostData[];
}

@Component({
  components: {
    OGPCard,
    ContentSection
  }
})
export default class PostListTemplate extends Vue {
  @Prop({ default: undefined })
    data!: PostListTemplateData
}
</script>

<style>

</style>
