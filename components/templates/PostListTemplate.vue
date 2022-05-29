<template>
  <v-card elevation="1" class="pa-6">
    <ContentSection title="Posts">
      <OGPCard
        v-for="post in data.posts"
        :key="post.id"
        class="ma-4"
        :url="post.url"
        :title="post.title"
        :description="post.body.slice(0, 140) + '...'"
        site_name="qiita.com"
        :image="require('~/static/qiita_logo-background-color.png')"
      />
    </ContentSection>
  </v-card>
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
  private data!: PostListTemplateData
}
</script>

<style>
</style>
