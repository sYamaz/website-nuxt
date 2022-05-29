import type { NuxtAxiosInstance } from '@nuxtjs/axios'
import { PostData } from '~/types/Qiita/Api/v2/datas'
import IApi from '~/types/Qiita/Api/v2/IApi'

export default class QiitaApi implements IApi {
  private readonly axios: NuxtAxiosInstance

  constructor (axios: NuxtAxiosInstance) {
    this.axios = axios
  }

  public async getMyQiitaItems (): Promise<PostData[]> {
    // const url = 'authenticated_user/items'
    // try {
    //   const response : PostData[] = await this.axios.$get(url)
    //   return response
    // } catch (e) {
    //   return Promise.reject(e)
    // }

    const url = 'items'
    try {
      const response: PostData[] = await this.axios.$get(url, {
        params: {
          query: 'user:sYamaz'
        }
      })
      return response
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
