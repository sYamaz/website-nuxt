/**
 * 投稿データ内のタグ情報
 */
export interface PostTag{
  name:string
  versions:string[]
}

/**
 * 投稿データ
 * https://qiita.com/api/v2/docs#%E6%8A%95%E7%A8%BF
 * */
export interface PostData{
  /** HTML形式の本文 */
  rendered_body:string
  /** Markdown形式の本文 */
  body:string
  /** この記事が共同更新状態かどうか (Qiita Teamでのみ有効) */
  coediting:boolean
  /** この記事へのコメントの数 */
  comments_count:number
  /** データが作成された日時 */
  created_at:string
  /** Qiita Teamのグループを表します。 */
  group:any
  /** 記事の一意なID */
  id:string
  /** この記事への「LGTM！」の数（Qiitaでのみ有効） */
  likes_count:number
  /** 限定共有状態かどうかを表すフラグ (Qiita Teamでは無効) */
  private:boolean
  /** 絵文字リアクションの数（Qiita Teamでのみ有効） */
  reactions_count:number
  /** 記事に付いたタグ一覧 */
  tags:PostTag[]
  /** 記事のタイトル */
  title:string
  /** データが最後に更新された日時 */
  updated_at:string
  /** Qiita上のユーザー情報 */
  user: any
  /** 記事のurl */
  url:string
  /** Qiita上のユーザーを表します。 */
  page_views_count:number | null
  /** Qiita Teamのチームメンバー情報を表します */
  team_membership: any
}
