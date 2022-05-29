import IApi from '~/types/Qiita/Api/v2/IApi'
import { PostData } from '~/types/Qiita/Api/v2/datas'

export class QiitaApi implements IApi {
  public async getMyQiitaItems (): Promise<PostData[]> {
    await new Promise(resolve => setTimeout(resolve, 10))

    return [
      {
        rendered_body: '',
        body: '',
        coediting: false,
        comments_count: 10,
        created_at: '2000-01-01T00:00:00+00:00',
        group: null,
        id: 'AAAAAAAA',
        likes_count: 10,
        private: false,
        reactions_count: 10,
        tags: null,
        title: 'AAAAAAAA',
        updated_at: '2000-01-01T00:00:00+00:00',
        url: '',
        user: null,
        page_views_count: 100,
        team_membership: null
      }
    ]
  }
}
