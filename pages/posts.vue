<template>
  <v-container>
    <h2>Posts</h2>
    <OGPCard
      v-for="post in posts"
      :key="posts.id"
      class="ma-4"
      :url="post.url"
      :title="post.title"
      :description="post.body.slice(0, 140) + '...'"
      site_name="qiita.com"
      :image="require('../static/qiita_logo-background-color.png')"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import { PostData } from '~/types/Qiita/Api/v2/datas'
import OGPCard from '~/components/molecules/OGPCard.vue'
import { articles } from '~/constants/articles'

@Component({
  components: {
    OGPCard
  },
  asyncData (_:Context) {
    // const ret = await context.app.$qiitaApi.getMyQiitaItems()
    console.log(articles)
    return { posts: articles }
  }
})
export default class PostPage extends Vue {
  readonly header = [
    {
      text: 'id',
      align: 'start',
      sortable: false,
      value: 'id'
    },
    {
      text: 'html',
      value: 'rendered_body'
    },
    {
      text: 'markdown',
      value: 'body'
    },
    {
      text: 'coediting',
      value: 'coediting'
    },
    {
      text: 'comment_count',
      value: 'comment_count'
    },
    {
      text: 'created_at',
      value: 'coediting'
    },
    {
      text: 'group',
      value: 'group'
    },
    {
      text: 'likes_count',
      value: 'likes_count'
    },
    {
      text: 'private',
      value: 'private'
    },
    {
      text: 'reactions_count',
      value: 'reactions_count'
    },
    {
      text: 'tags',
      value: 'tags'
    },
    {
      text: 'title',
      value: 'title'
    },
    {
      text: 'updated_at',
      value: 'updated_at'
    },
    {
      text: 'url',
      value: 'url'
    },
    {
      text: 'page_views_count',
      value: 'page_views_count'
    },
    {
      text: 'team_membership',
      value: 'team_membership'
    }
  ]

  posts?: PostData[]
}
</script>

<style>

</style>
