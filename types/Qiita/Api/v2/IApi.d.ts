import { PostData } from './datas'

export default interface IApi {
  getMyQiitaItems(): Promise<PostData[]>
}
