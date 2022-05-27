<template>
  <PostListTemplate :data="data" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import { PostData } from '~/types/Qiita/Api/v2/datas'
import { articles } from '~/constants/articles'
import PostListTemplate, { PostListTemplateData } from '~/components/templates/PostListTemplate.vue'

@Component({
  components: {
    PostListTemplate
  },
  asyncData (_:Context) {
    // const ret = await context.app.$qiitaApi.getMyQiitaItems()
    console.log(articles)
    const posts: PostData[] = articles
    const ret: PostListTemplateData = {
      posts
    }
    return ret
  }
})
export default class PostPage extends Vue {
  posts?: PostData[]

  data?: PostListTemplateData
}
</script>

<style>

</style>
