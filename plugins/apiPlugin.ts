import { Plugin } from '@nuxt/types'
import QiitaApi from '~/api/QiitaApi'
import { QiitaApi as MockApi } from '~/mock/QiitaApi'
import IApi from '~/types/Qiita/Api/v2/IApi'

// vueインスタンスから$qiitaApiを使用可能にする
declare module 'vue/types/vue' {
  interface Vue {
    $qiitaApi: IApi
  }
}

// this.$nuxt.contextから$qiitaApiを使用可能にする
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $qiitaApi: IApi
  }

  interface Context {
    $qiitaApi: IApi
  }
}

export const apiPlugin: Plugin = (context, inject): void => {
  const qiitaAxios = context.$axios.create({
    // baseURL: context.$config.baseURL
    baseURL: 'https://qiita.com/api/v2/',
    headers: { }
  })

  inject('qiitaApi', new QiitaApi(qiitaAxios))
}

export default apiPlugin
