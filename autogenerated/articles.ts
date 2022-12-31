export const articles = [{rendered_body: `<p data-sourcepos="1:1-1:233">読み上げてくれればチャット欄見なくていいよねってことで、Youtube APIからライブ配信のコメントをポーリングしつつ、取得したコメントを読み上げさせようとTryしました。</p>
<p data-sourcepos="3:1-3:48">主に処理部分についての話をします</p>
<h2 data-sourcepos="5:1-5:9">
<span id="要素" class="fragment"></span><a href="#%E8%A6%81%E7%B4%A0"><i class="fa fa-link"></i></a>要素</h2>
<h3 data-sourcepos="7:1-7:49">
<span id="youtube-apidata-api-live-streaming-api" class="fragment"></span><a href="#youtube-apidata-api-live-streaming-api"><i class="fa fa-link"></i></a>Youtube API（Data API, Live Streaming API）</h3>
<p data-sourcepos="9:1-9:78">今回使用するAPIは以下です。いずれもAPIキーで認証します</p>
<h4 data-sourcepos="11:1-11:77">
<span id="videoshttpsdevelopersgooglecomyoutubev3docsvideoslisthlja" class="fragment"></span><a href="#videoshttpsdevelopersgooglecomyoutubev3docsvideoslisthlja"><i class="fa fa-link"></i></a>Videos：<a href="https://developers.google.com/youtube/v3/docs/videos/list?hl=ja" class="autolink" rel="nofollow noopener" target="_blank">https://developers.google.com/youtube/v3/docs/videos/list?hl=ja</a>
</h4>
<p data-sourcepos="13:1-13:76">動画IDを引数にデータを取得し、チャットIDを取得します</p>
<div class="code-frame" data-lang="ts" data-sourcepos="15:1-41:3"><div class="highlight"><pre><code>
<span class="c1">// VideoResponseは省略</span>

<span class="k">export</span> <span class="kr">interface</span> <span class="nx">IVideoApi</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="nx">list</span><span class="p">(</span><span class="nx">videoId</span><span class="p">:</span><span class="kr">string</span><span class="p">)</span> <span class="p">:</span><span class="nb">Promise</span><span class="o">&lt;</span><span class="nx">VideoResponse</span><span class="o">&gt;</span>
<span class="p">${"$"}{"}"}</span>

<span class="k">export</span> <span class="kd">class</span> <span class="nx">VideoApi</span> <span class="k">implements</span> <span class="nx">IVideoApi</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="k">private</span> <span class="k">readonly</span> <span class="nx">key</span><span class="p">:</span><span class="kr">string</span>

  <span class="kd">constructor</span><span class="p">(</span><span class="nx">key</span><span class="p">:</span><span class="kr">string</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">this</span><span class="p">.</span><span class="nx">key</span> <span class="o">=</span> <span class="nx">key</span>
  <span class="p">${"$"}{"}"}</span>

  <span class="nx">list</span><span class="p">(</span><span class="nx">videoId</span><span class="p">:</span><span class="kr">string</span><span class="p">):</span> <span class="nb">Promise</span><span class="o">&lt;</span><span class="nx">VideoResponse</span><span class="o">&gt;</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">const</span> <span class="na">config</span><span class="p">:</span> <span class="nx">AxiosRequestConfig</span> <span class="o">=</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
      <span class="na">params</span><span class="p">:${"$"}{"{"${"$"}{"}"}</span>
        <span class="na">part</span><span class="p">:</span> <span class="dl">"</span><span class="s2">liveStreamingDetails</span><span class="dl">"</span><span class="p">,</span>
        <span class="na">id</span><span class="p">:</span> <span class="nx">videoId</span><span class="p">,</span>
        <span class="na">key</span><span class="p">:</span><span class="k">this</span><span class="p">.</span><span class="nx">key</span>
      <span class="p">${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span>
    <span class="k">return</span> <span class="nx">axios</span><span class="p">.</span><span class="kd">get</span><span class="p">(</span><span class="dl">"</span><span class="s2">https://www.googleapis.com/youtube/v3/videos</span><span class="dl">"</span><span class="p">,</span> <span class="nx">config</span><span class="p">).</span><span class="nx">then</span><span class="p">(</span><span class="nx">r</span> <span class="o">=&gt;</span> <span class="nx">r</span><span class="p">.</span><span class="nx">data</span><span class="p">)</span>
  <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>
<h4 data-sourcepos="45:1-45:96">
<span id="livechatmessageshttpsdevelopersgooglecomyoutubev3livedocslivechatmessageslist" class="fragment"></span><a href="#livechatmessageshttpsdevelopersgooglecomyoutubev3livedocslivechatmessageslist"><i class="fa fa-link"></i></a>LiveChatMessages：<a href="https://developers.google.com/youtube/v3/live/docs/liveChatMessages/list" class="autolink" rel="nofollow noopener" target="_blank">https://developers.google.com/youtube/v3/live/docs/liveChatMessages/list</a>
</h4>
<p data-sourcepos="47:1-47:246">チャットIDを引数にコメントを取得します。レスポンスのpageTokenを引数に使用することでコメントをつづきから取得できるので、apiのパラメータは初回/それ以降の２種類にしました。</p>
<div class="code-frame" data-lang="ts" data-sourcepos="49:1-86:3"><div class="highlight"><pre><code>
<span class="c1">// LiveChatMessagesResponseは省略</span>

<span class="k">export</span> <span class="kd">class</span> <span class="nx">LiveChatMessagesApi</span> <span class="k">implements</span> <span class="nx">ILiveChatMessagesApi</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="k">private</span> <span class="k">readonly</span> <span class="nx">key</span><span class="p">:</span><span class="kr">string</span> <span class="o">=</span> <span class="dl">""</span>
  <span class="kd">constructor</span><span class="p">(</span><span class="nx">key</span><span class="p">:</span><span class="kr">string</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">this</span><span class="p">.</span><span class="nx">key</span> <span class="o">=</span> <span class="nx">key</span>
  <span class="p">${"$"}{"}"}</span>

  <span class="k">async</span> <span class="nx">startList</span><span class="p">(</span><span class="nx">liveChatId</span><span class="p">:</span> <span class="kr">string</span><span class="p">,</span> <span class="nx">maxResults</span><span class="p">:</span> <span class="kr">number</span><span class="p">,</span> <span class="nx">nextPageToken</span><span class="p">:</span> <span class="kr">string</span> <span class="o">|</span> <span class="kc">null</span><span class="p">):</span> <span class="nb">Promise</span><span class="o">&lt;</span><span class="nx">LiveChatMessagesResponse</span><span class="o">&gt;</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">let</span> <span class="na">config</span><span class="p">:</span> <span class="nx">AxiosRequestConfig</span>
    <span class="k">if</span> <span class="p">(</span><span class="nx">nextPageToken</span> <span class="o">===</span> <span class="kc">null</span><span class="p">)</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
      <span class="nx">config</span> <span class="o">=</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="na">params</span><span class="p">:${"$"}{"{"${"$"}{"}"}</span>
          <span class="nx">liveChatId</span><span class="p">,</span>
          <span class="na">part</span><span class="p">:</span> <span class="dl">"</span><span class="s2">id,snippet,authorDetails</span><span class="dl">"</span><span class="p">,</span>
          <span class="nx">maxResults</span><span class="p">,</span>
          <span class="na">key</span><span class="p">:</span><span class="k">this</span><span class="p">.</span><span class="nx">key</span>
        <span class="p">${"$"}{"}"}</span>
      <span class="p">${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span> <span class="k">else</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
      <span class="nx">config</span> <span class="o">=</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="na">params</span><span class="p">:${"$"}{"{"${"$"}{"}"}</span>
          <span class="nx">liveChatId</span><span class="p">,</span>
          <span class="na">part</span><span class="p">:</span> <span class="dl">"</span><span class="s2">id,snippet,authorDetails</span><span class="dl">"</span><span class="p">,</span>
          <span class="nx">maxResults</span><span class="p">,</span>
          <span class="na">key</span><span class="p">:</span><span class="k">this</span><span class="p">.</span><span class="nx">key</span><span class="p">,</span>
          <span class="na">pageToken</span><span class="p">:</span><span class="nx">nextPageToken</span>
        <span class="p">${"$"}{"}"}</span>
      <span class="p">${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">const</span> <span class="nx">response</span> <span class="o">=</span> <span class="k">await</span> <span class="nx">axios</span><span class="p">.</span><span class="kd">get</span><span class="p">(</span><span class="dl">"</span><span class="s2">https://www.googleapis.com/youtube/v3/liveChat/messages</span><span class="dl">"</span><span class="p">,</span> <span class="nx">config</span><span class="p">)</span>
    <span class="k">return</span> <span class="nx">response</span><span class="p">.</span><span class="nx">data</span>
  <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>
<h3 data-sourcepos="88:1-88:19">
<span id="speechsynthesis" class="fragment"></span><a href="#speechsynthesis"><i class="fa fa-link"></i></a>SpeechSynthesis</h3>
<p data-sourcepos="90:1-90:33">文字列を読み上げさせる</p>
<div class="code-frame" data-lang="ts" data-sourcepos="92:1-105:3"><div class="highlight"><pre><code><span class="k">export</span> <span class="kr">interface</span> <span class="nx">ISpeaker</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="nx">speak</span><span class="p">(</span><span class="nx">txt</span><span class="p">:</span><span class="kr">string</span><span class="p">):</span><span class="k">void</span>
<span class="p">${"$"}{"}"}</span>

<span class="k">export</span> <span class="kd">class</span> <span class="nx">Speaker</span> <span class="k">implements</span> <span class="nx">ISpeaker</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="c1">// 設計の都合上クラスにしているが、この関数だけで良い</span>
  <span class="nx">speak</span><span class="p">(</span><span class="nx">txt</span><span class="p">:</span> <span class="kr">string</span><span class="p">):</span> <span class="k">void</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">const</span> <span class="nx">synthes</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">SpeechSynthesisUtterance</span><span class="p">(</span><span class="nx">txt</span><span class="p">)</span>
    <span class="nx">synthes</span><span class="p">.</span><span class="nx">lang</span> <span class="o">=</span> <span class="dl">"</span><span class="s2">ja-JP</span><span class="dl">"</span>
    <span class="nx">speechSynthesis</span><span class="p">.</span><span class="nx">speak</span><span class="p">(</span><span class="nx">synthes</span><span class="p">)</span>
  <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>
<h2 data-sourcepos="107:1-107:24">
<span id="処理のイメージ" class="fragment"></span><a href="#%E5%87%A6%E7%90%86%E3%81%AE%E3%82%A4%E3%83%A1%E3%83%BC%E3%82%B8"><i class="fa fa-link"></i></a>処理のイメージ</h2>
<ul data-sourcepos="109:1-112:0">
<li data-sourcepos="109:1-109:60">角丸長方形はオブジェクト、長方形は処理</li>
<li data-sourcepos="110:1-110:68">実線は処理の流れ、点線はオブジェクトへの参照</li>
<li data-sourcepos="111:1-112:0">APIからコメント取得するのと読み上げは非同期ループ</li>
</ul>
<p data-sourcepos="113:1-113:27">というイメージです</p>
<qiita-mermaid data-content='${"$"}{"{"${"$"}{"}"}"data":"graph TD;\\n\\nA[urlから動画ID取得]\\nB[Videos APIからチャットID取得]\\nC[LiveChatMessages APIからコメント取得]\\nD[インターバル]\\nstore(コメントのキュー FIFO)\\nhistory(読み上げたものの履歴)\\nZ[コメント読み上げ]\\nY[インターバル]\\n\\nA--&gt;B\\nB--&gt;C\\nC--&gt;D\\nD--停止するまで繰り返す--&gt;B\\nC-.登録.-&gt;store\\n\\nZ-.取得.-&gt;store\\nZ--&gt;Y\\nY--停止するまで繰り返す--&gt;Z\\nZ-.登録.-&gt;history\\n","key":"438b683b35f6d031efd58ae93998a5fc"${"$"}{"}"}'></qiita-mermaid>
<p data-sourcepos="140:1-140:183"><code>読み上げたものの履歴</code>をUIに表示させればWebアプリとしてはある程度の形になります。(ユーザー名、コメント内容は黄色で伏せてます)</p>
<p data-sourcepos="142:1-142:164"><a href="https://camo.qiitausercontent.com/357512f3981c08ed2daa0392ed19a03de0303d28/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f39373463383030632d666661662d373539612d633737652d3738343164323866396337362e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F974c800c-ffaf-759a-c77e-7841d28f9c76.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=4a28428fd388d603d900a83ab669f606" alt="スクリーンショット 2022-07-28 22.33.53.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/974c800c-ffaf-759a-c77e-7841d28f9c76.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F974c800c-ffaf-759a-c77e-7841d28f9c76.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=3d8fb8f2aed3a1b2dd8876d8f20fd508 1x" loading="lazy"></a></p>
`,body: `読み上げてくれればチャット欄見なくていいよねってことで、Youtube APIからライブ配信のコメントをポーリングしつつ、取得したコメントを読み上げさせようとTryしました。

主に処理部分についての話をします

## 要素

### Youtube API（Data API, Live Streaming API）

今回使用するAPIは以下です。いずれもAPIキーで認証します

#### Videos：https://developers.google.com/youtube/v3/docs/videos/list?hl=ja
    
動画IDを引数にデータを取得し、チャットIDを取得します

\`\`\`ts 

// VideoResponseは省略

export interface IVideoApi${"$"}{"{"${"$"}{"}"}
  list(videoId:string) :Promise<VideoResponse>
${"$"}{"}"}

export class VideoApi implements IVideoApi${"$"}{"{"${"$"}{"}"}
  private readonly key:string

  constructor(key:string)${"$"}{"{"${"$"}{"}"}
    this.key = key
  ${"$"}{"}"}

  list(videoId:string): Promise<VideoResponse> ${"$"}{"{"${"$"}{"}"}
    const config: AxiosRequestConfig = ${"$"}{"{"${"$"}{"}"}
      params:${"$"}{"{"${"$"}{"}"}
        part: "liveStreamingDetails",
        id: videoId,
        key:this.key
      ${"$"}{"}"}
    ${"$"}{"}"}
    return axios.get("https://www.googleapis.com/youtube/v3/videos", config).then(r => r.data)
  ${"$"}{"}"}
${"$"}{"}"}
\`\`\`



#### LiveChatMessages：https://developers.google.com/youtube/v3/live/docs/liveChatMessages/list

チャットIDを引数にコメントを取得します。レスポンスのpageTokenを引数に使用することでコメントをつづきから取得できるので、apiのパラメータは初回/それ以降の２種類にしました。

\`\`\`ts 

// LiveChatMessagesResponseは省略

export class LiveChatMessagesApi implements ILiveChatMessagesApi${"$"}{"{"${"$"}{"}"}
  private readonly key:string = ""
  constructor(key:string)${"$"}{"{"${"$"}{"}"}
    this.key = key
  ${"$"}{"}"}

  async startList(liveChatId: string, maxResults: number, nextPageToken: string | null): Promise<LiveChatMessagesResponse> ${"$"}{"{"${"$"}{"}"}
    let config: AxiosRequestConfig
    if (nextPageToken === null) ${"$"}{"{"${"$"}{"}"}
      config = ${"$"}{"{"${"$"}{"}"}
        params:${"$"}{"{"${"$"}{"}"}
          liveChatId,
          part: "id,snippet,authorDetails",
          maxResults,
          key:this.key
        ${"$"}{"}"}
      ${"$"}{"}"}
    ${"$"}{"}"} else ${"$"}{"{"${"$"}{"}"}
      config = ${"$"}{"{"${"$"}{"}"}
        params:${"$"}{"{"${"$"}{"}"}
          liveChatId,
          part: "id,snippet,authorDetails",
          maxResults,
          key:this.key,
          pageToken:nextPageToken
        ${"$"}{"}"}
      ${"$"}{"}"}
    ${"$"}{"}"}

    const response = await axios.get("https://www.googleapis.com/youtube/v3/liveChat/messages", config)
    return response.data
  ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

### SpeechSynthesis

文字列を読み上げさせる

\`\`\`ts 
export interface ISpeaker${"$"}{"{"${"$"}{"}"}
  speak(txt:string):void
${"$"}{"}"}

export class Speaker implements ISpeaker${"$"}{"{"${"$"}{"}"}
  // 設計の都合上クラスにしているが、この関数だけで良い
  speak(txt: string): void ${"$"}{"{"${"$"}{"}"}
    const synthes = new SpeechSynthesisUtterance(txt)
    synthes.lang = "ja-JP"
    speechSynthesis.speak(synthes)
  ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

## 処理のイメージ 

* 角丸長方形はオブジェクト、長方形は処理 
* 実線は処理の流れ、点線はオブジェクトへの参照
* APIからコメント取得するのと読み上げは非同期ループ

というイメージです

\`\`\`mermaid 
graph TD;

A[urlから動画ID取得]
B[Videos APIからチャットID取得]
C[LiveChatMessages APIからコメント取得]
D[インターバル]
store(コメントのキュー FIFO)
history(読み上げたものの履歴)
Z[コメント読み上げ]
Y[インターバル]

A-->B
B-->C
C-->D
D--停止するまで繰り返す-->B
C-.登録.->store

Z-.取得.->store
Z-->Y
Y--停止するまで繰り返す-->Z
Z-.登録.->history

\`\`\`

\`読み上げたものの履歴\`をUIに表示させればWebアプリとしてはある程度の形になります。(ユーザー名、コメント内容は黄色で伏せてます)

![スクリーンショット 2022-07-28 22.33.53.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/974c800c-ffaf-759a-c77e-7841d28f9c76.png)









`,coediting: false,comments_count: 0,created_at: '2022-07-28T22:45:16+09:00',group: '{ }',id: '885647616aa57f00a604',likes_count: 1,private: false,reactions_count: 0,tags: [{name: 'TypeScript',versions: [  ]},{name: 'YouTubeAPI',versions: [  ]},{name: 'SpeechSynthesis',versions: [  ]},{name: 'axios',versions: [  ]}],title: 'Youtube API使って得たコメント読み上げさせたい',updated_at: '2022-07-28T22:50:12+09:00',url: 'https://qiita.com/sYamaz/items/885647616aa57f00a604',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p data-sourcepos="1:1-2:38">PythonでQiitaApiから自分の記事一覧を取得し、コードを自動生成できるようになりました。<br>
今回はGitHub Actionsを用いて、</p>
<ol data-sourcepos="4:1-7:0">
<li data-sourcepos="4:1-4:68">QiitaApiから記事一覧を取得し、コードを自動生成</li>
<li data-sourcepos="5:1-5:30">コミット、プッシュ</li>
<li data-sourcepos="6:1-7:0">GitHub Pagesにデプロイ</li>
</ol>
<p data-sourcepos="8:1-8:137">の一連の作業を毎日朝の３時に実行できるようにします。ということで以下のworkflowを作成しました。</p>
<div class="code-frame" data-lang="yaml" data-sourcepos="10:1-59:3">
<div class="code-lang"><span class="bold">~/github/workflows/update_articles.yaml</span></div>
<div class="highlight"><pre><code><span class="na">name</span><span class="pi">:</span> <span class="s">GitHub Pages cron deploy</span>

<span class="na">on</span><span class="pi">:</span>
  <span class="na">schedule</span><span class="pi">:</span>
    <span class="c1"># 分 時 日 月 曜日 コマンド  UTC時間</span>
    <span class="c1"># 毎日日本時間3時に実行(設定時間の9時間後が日本時間になる)</span>
    <span class="pi">-</span> <span class="na">cron</span><span class="pi">:</span> <span class="s1">'</span><span class="s">0</span><span class="nv"> </span><span class="s">18</span><span class="nv"> </span><span class="s">*</span><span class="nv"> </span><span class="s">*</span><span class="nv"> </span><span class="s">*'</span>
  <span class="na">workflow_dispatch</span><span class="pi">:</span>
<span class="na">jobs</span><span class="pi">:</span>
  <span class="na">update_articles</span><span class="pi">:</span>
    <span class="na">runs-on</span><span class="pi">:</span> <span class="s">ubuntu-latest</span> 
    <span class="c1"># Python3がプリインストールされており、バージョンも特に気にしないため、actions/setup-pythonは今回は使わない</span>
    <span class="na">name</span><span class="pi">:</span> <span class="s">Update constants/articles.ts and marge</span>
    <span class="na">steps</span><span class="pi">:</span>
      <span class="c1"># デフォルトブランチをチェックアウトする</span>
      <span class="pi">-</span> <span class="na">uses</span><span class="pi">:</span> <span class="s">actions/checkout@v3</span>
      <span class="c1"># pythonモジュールをGithub Actionsコンテナ内に復元する</span>
      <span class="pi">-</span> <span class="na">name</span><span class="pi">:</span> <span class="s">Setup python modules</span>
        <span class="na">run</span><span class="pi">:</span> <span class="s">pip3 install -r requirements.txt</span>
      <span class="c1"># QiitaApiから記事を取得し、コードを自動生成するスクリプトを実行</span>
      <span class="pi">-</span> <span class="na">name</span><span class="pi">:</span> <span class="s">Generate articles.ts</span>
        <span class="na">run</span><span class="pi">:</span> <span class="s">python3 -B scripts/articles_generator.py constants/articles.ts</span>
      <span class="c1"># コミットしてプッシュ</span>
      <span class="pi">-</span> <span class="na">uses</span><span class="pi">:</span> <span class="s">EndBug/add-and-commit@v9</span>
        <span class="na">with</span><span class="pi">:</span>
          <span class="na">message</span><span class="pi">:</span> <span class="s1">'</span><span class="s">Update</span><span class="nv"> </span><span class="s">constants/articles.ts'</span>
  <span class="na">deploy</span><span class="pi">:</span>
    <span class="c1"># 上のjobが終わってから実行（設定しない場合並列に実行される）</span>
    <span class="na">needs</span><span class="pi">:</span> <span class="s">update_articles</span>

    <span class="na">runs-on</span><span class="pi">:</span> <span class="s">ubuntu-latest</span>
    <span class="na">name</span><span class="pi">:</span> <span class="s">Checkout, build, deploy</span>
    <span class="na">steps</span><span class="pi">:</span>
      <span class="c1"># jobごとにコンテナが異なるのでチェックアウトし直す</span>
      <span class="pi">-</span> <span class="na">uses</span><span class="pi">:</span> <span class="s">actions/checkout@v3</span>
      <span class="c1"># yarn (またはyarn install)でパッケージを取得</span>
      <span class="pi">-</span> <span class="na">name</span><span class="pi">:</span> <span class="s">Restore packages</span>
        <span class="na">run</span><span class="pi">:</span> <span class="s">yarn</span>
      <span class="c1"># ビルド（中身は環境変数の指定とnuxt build）</span>
      <span class="pi">-</span> <span class="na">name</span><span class="pi">:</span> <span class="s">Build</span>
        <span class="na">run</span><span class="pi">:</span> <span class="s">yarn generate:gh-pages</span>
      <span class="c1"># Github Pagesのブランチ(gh-pages)へdistフォルダの中身をデプロイ</span>
      <span class="pi">-</span> <span class="na">name</span><span class="pi">:</span> <span class="s">Deploy (puth dist dir to gh-pages branch)</span>
        <span class="na">uses</span><span class="pi">:</span> <span class="s">peaceiris/actions-gh-pages@v3</span>
        <span class="na">with</span><span class="pi">:</span>
          <span class="na">github_token</span><span class="pi">:</span> <span class="s">${"$"}${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"} secrets.GITHUB_TOKEN ${"$"}{"}"}${"$"}{"}"}</span>
          <span class="na">publish_dir</span><span class="pi">:</span> <span class="s">./dist</span>
          <span class="na">publish_branch</span><span class="pi">:</span> <span class="s">gh-pages</span>
</code></pre></div>
</div>
<h2 data-sourcepos="61:1-61:9">
<span id="結果" class="fragment"></span><a href="#%E7%B5%90%E6%9E%9C"><i class="fa fa-link"></i></a>結果</h2>
<p data-sourcepos="63:1-63:66">今日の3時ごろに実行されていたようなのでOKです</p>
<p data-sourcepos="65:1-65:62"><qiita-embed-ogp src="https://github.com/sYamaz/website-nuxt/actions/runs/2379795524"></qiita-embed-ogp></p>
`,body: `PythonでQiitaApiから自分の記事一覧を取得し、コードを自動生成できるようになりました。
今回はGitHub Actionsを用いて、

1. QiitaApiから記事一覧を取得し、コードを自動生成
2. コミット、プッシュ
3. GitHub Pagesにデプロイ

の一連の作業を毎日朝の３時に実行できるようにします。ということで以下のworkflowを作成しました。

\`\`\`~/github/workflows/update_articles.yaml
name: GitHub Pages cron deploy

on:
  schedule:
    # 分 時 日 月 曜日 コマンド  UTC時間
    # 毎日日本時間3時に実行(設定時間の9時間後が日本時間になる)
    - cron: '0 18 * * *'
  workflow_dispatch:
jobs:
  update_articles:
    runs-on: ubuntu-latest 
    # Python3がプリインストールされており、バージョンも特に気にしないため、actions/setup-pythonは今回は使わない
    name: Update constants/articles.ts and marge
    steps:
      # デフォルトブランチをチェックアウトする
      - uses: actions/checkout@v3
      # pythonモジュールをGithub Actionsコンテナ内に復元する
      - name: Setup python modules
        run: pip3 install -r requirements.txt
      # QiitaApiから記事を取得し、コードを自動生成するスクリプトを実行
      - name: Generate articles.ts
        run: python3 -B scripts/articles_generator.py constants/articles.ts
      # コミットしてプッシュ
      - uses: EndBug/add-and-commit@v9
        with:
          message: 'Update constants/articles.ts'
  deploy:
    # 上のjobが終わってから実行（設定しない場合並列に実行される）
    needs: update_articles

    runs-on: ubuntu-latest
    name: Checkout, build, deploy
    steps:
      # jobごとにコンテナが異なるのでチェックアウトし直す
      - uses: actions/checkout@v3
      # yarn (またはyarn install)でパッケージを取得
      - name: Restore packages
        run: yarn
      # ビルド（中身は環境変数の指定とnuxt build）
      - name: Build
        run: yarn generate:gh-pages
      # Github Pagesのブランチ(gh-pages)へdistフォルダの中身をデプロイ
      - name: Deploy (puth dist dir to gh-pages branch)
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${"$"}${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"} secrets.GITHUB_TOKEN ${"$"}{"}"}${"$"}{"}"}
          publish_dir: ./dist
          publish_branch: gh-pages
\`\`\`

## 結果

今日の3時ごろに実行されていたようなのでOKです

https://github.com/sYamaz/website-nuxt/actions/runs/2379795524
`,coediting: false,comments_count: 0,created_at: '2022-05-25T20:28:51+09:00',group: '{ }',id: '4a647ad0fafbf0e1e6c0',likes_count: 2,private: false,reactions_count: 0,tags: [{name: 'QiitaAPI',versions: [  ]},{name: 'githubpages',versions: [  ]},{name: 'GitHubActions',versions: [  ]}],title: 'GitHubPagesの内容をGitHubActionsを使って自動更新する',updated_at: '2022-05-25T20:28:51+09:00',url: 'https://qiita.com/sYamaz/items/4a647ad0fafbf0e1e6c0',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p data-sourcepos="1:1-1:85">先日@nuxt/axiosを使ってQiitaApiから自分の記事一覧を取得しました</p>
<p data-sourcepos="3:1-3:51"><qiita-embed-ogp src="https://qiita.com/sYamaz/items/10c8c9db83e5dad62b90"></qiita-embed-ogp></p>
<p data-sourcepos="5:1-5:209">ただ、この記事の最後に書いたようにスクリプトでコードを自動生成する方が目的に会っていると思っていたのでPythonでQiitaApiにアクセスしようと思います</p>
<h3 data-sourcepos="7:1-7:10">
<span id="環境" class="fragment"></span><a href="#%E7%92%B0%E5%A2%83"><i class="fa fa-link"></i></a>環境</h3>
<ul data-sourcepos="9:1-11:0">
<li data-sourcepos="9:1-11:0">Python 3.8.9
<ul data-sourcepos="10:5-11:0">
<li data-sourcepos="10:5-11:0"><code>pip install requests</code></li>
</ul>
</li>
</ul>
<h3 data-sourcepos="12:1-12:19">
<span id="スクリプト" class="fragment"></span><a href="#%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88"><i class="fa fa-link"></i></a>スクリプト</h3>
<p data-sourcepos="14:1-14:103"><code>requests</code>パッケージを使用しApiから記事一覧を取得します。簡潔に書くと以下</p>
<div class="code-frame" data-lang="python" data-sourcepos="16:1-26:3"><div class="highlight"><pre><code><span class="kn">import</span> <span class="nn">requests</span>
<span class="kn">import</span> <span class="nn">json</span>

<span class="n">response</span> <span class="o">=</span> <span class="n">requests</span><span class="p">.</span><span class="n">get</span><span class="p">(</span><span class="s">'https://qiita.com/api/v2/items?query=user:sYamaz'</span><span class="p">)</span>

<span class="n">items</span> <span class="o">=</span> <span class="n">json</span><span class="p">.</span><span class="n">loads</span><span class="p">(</span><span class="n">response</span><span class="p">.</span><span class="n">text</span><span class="p">)</span>
<span class="k">for</span> <span class="n">item</span> <span class="ow">in</span> <span class="n">items</span><span class="p">:</span>
  <span class="c1"># item(=記事)ごとの処理
</span>
</code></pre></div></div>
<p data-sourcepos="28:1-28:74">この内容をもとにarticles.tsを出力できるようにします。</p>
<p data-sourcepos="30:1-30:18">期待する内容</p>
<div class="code-frame" data-lang="typescript" data-sourcepos="32:1-42:3">
<div class="code-lang"><span class="bold">autogenerated/articles.ts</span></div>
<div class="highlight"><pre><code><span class="k">export</span> <span class="kd">const</span> <span class="nx">articles</span> <span class="o">=</span> <span class="p">[</span>
  <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="na">rendered_body</span><span class="p">:</span> <span class="dl">'</span><span class="s1">........</span><span class="dl">'</span>
    <span class="na">body</span><span class="p">:</span> <span class="dl">'</span><span class="s1">.......</span><span class="dl">'</span>
    <span class="p">...</span> <span class="nx">略</span>
  <span class="p">${"$"}{"}"},</span>
  <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="p">...</span> <span class="p">${"$"}{"}"}</span>
  <span class="p">...</span><span class="nx">略</span>
<span class="p">]</span>
</code></pre></div>
</div>
<details><summary>スクリプト全文（長いので折りたたみ）</summary><div>
<div class="code-frame" data-lang="python" data-sourcepos="46:1-210:3"><div class="highlight"><pre><code><span class="kn">import</span> <span class="nn">sys</span>
<span class="kn">import</span> <span class="nn">json</span>
<span class="kn">import</span> <span class="nn">io</span>
<span class="kn">import</span> <span class="nn">requests</span>
<span class="kn">import</span> <span class="nn">os</span>

<span class="k">def</span> <span class="nf">escape</span><span class="p">(</span><span class="nb">input</span><span class="p">:</span><span class="nb">str</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="nb">str</span><span class="p">:</span>
  <span class="k">return</span> <span class="nb">input</span><span class="p">.</span><span class="n">replace</span><span class="p">(</span><span class="s">'</span><span class="se">\\\\</span><span class="s">'</span><span class="p">,</span> <span class="s">'</span><span class="se">\\\\\\\\</span><span class="s">'</span><span class="p">)</span>\\
              <span class="p">.</span><span class="n">replace</span><span class="p">(</span><span class="s">'\`'</span><span class="p">,</span> <span class="s">'\\\`'</span><span class="p">)</span>\\
              <span class="p">.</span><span class="n">replace</span><span class="p">(</span><span class="s">'${"$"}{"{"${"$"}{"}"}'</span><span class="p">,</span> <span class="s">'${"$"}${"$"}{"{"${"$"}{"}"}"${"$"}{"{"${"$"}{"}"}"${"$"}{"}"}'</span><span class="p">)</span>\\
              <span class="p">.</span><span class="n">replace</span><span class="p">(</span><span class="s">'${"$"}{"}"}'</span><span class="p">,</span> <span class="s">'${"$"}${"$"}{"{"${"$"}{"}"}"${"$"}{"}"}"${"$"}{"}"}'</span><span class="p">)</span>\\
              <span class="p">.</span><span class="n">replace</span><span class="p">(</span><span class="s">'${"$"}'</span><span class="p">,</span> <span class="s">'${"$"}${"$"}{"{"${"$"}{"}"}"${"$"}"${"$"}{"}"}'</span><span class="p">)</span>

<span class="k">def</span> <span class="nf">Empty</span><span class="p">()</span> <span class="o">-&gt;</span> <span class="nb">str</span><span class="p">:</span>
  <span class="k">return</span> <span class="s">'${"$"}{"{"${"$"}{"}"} ${"$"}{"}"}'</span>

<span class="k">def</span> <span class="nf">Group</span><span class="p">(</span><span class="n">grp</span><span class="p">:</span><span class="nb">dict</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="nb">str</span><span class="p">:</span>
  <span class="k">if</span><span class="p">(</span><span class="n">grp</span> <span class="ow">is</span> <span class="bp">None</span><span class="p">):</span>
    <span class="k">return</span> <span class="n">Empty</span><span class="p">()</span>

  <span class="n">created_at</span> <span class="o">=</span> <span class="n">grp</span><span class="p">[</span><span class="s">'created_at'</span><span class="p">]</span>
  <span class="n">description</span> <span class="o">=</span> <span class="n">grp</span><span class="p">[</span><span class="s">'description'</span><span class="p">]</span>
  <span class="n">name</span> <span class="o">=</span> <span class="n">grp</span><span class="p">[</span><span class="s">'name'</span><span class="p">]</span>
  <span class="n">private</span> <span class="o">=</span> <span class="n">grp</span><span class="p">[</span><span class="s">'private'</span><span class="p">]</span>
  <span class="n">updated_at</span> <span class="o">=</span> <span class="n">grp</span><span class="p">[</span><span class="s">'updated_at'</span><span class="p">]</span>
  <span class="n">url_name</span> <span class="o">=</span> <span class="n">grp</span><span class="p">[</span><span class="s">'url_name'</span><span class="p">]</span>

  <span class="n">arr</span> <span class="o">=</span> <span class="p">[]</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'created_at: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">created_at</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'description: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">description</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'name: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">name</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'private: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="nb">str</span><span class="p">(</span><span class="n">private</span><span class="p">).</span><span class="n">lower</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'updated_at: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">updated_at</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'url_name: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">url_name</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="k">return</span> <span class="s">'${"$"}{"{"${"$"}{"}"}'</span> <span class="o">+</span> <span class="s">',</span><span class="se">\\n</span><span class="s">'</span><span class="p">.</span><span class="n">join</span><span class="p">(</span><span class="n">arr</span><span class="p">)</span> <span class="o">+</span>  <span class="s">'${"$"}{"}"}'</span>

<span class="k">def</span> <span class="nf">Tag</span><span class="p">(</span><span class="n">tag</span><span class="p">:</span><span class="nb">dict</span><span class="p">):</span>
  <span class="n">name</span> <span class="o">=</span> <span class="n">tag</span><span class="p">[</span><span class="s">'name'</span><span class="p">]</span>
  <span class="n">versions</span> <span class="o">=</span> <span class="n">tag</span><span class="p">[</span><span class="s">'versions'</span><span class="p">]</span>
  <span class="n">arr</span> <span class="o">=</span> <span class="p">[]</span>
  <span class="n">delimiter</span> <span class="o">=</span> <span class="s">','</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'name: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">name</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">vals</span> <span class="o">=</span> <span class="n">delimiter</span><span class="p">.</span><span class="n">join</span><span class="p">(</span><span class="nb">map</span><span class="p">(</span><span class="k">lambda</span> <span class="n">v</span><span class="p">:</span> <span class="sa">f</span><span class="s">'</span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">v</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span> <span class="p">,</span><span class="n">versions</span><span class="p">))</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'versions: [ </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">vals</span><span class="si">${"$"}{"}"}</span><span class="s"> ]'</span><span class="p">)</span>
  <span class="k">return</span> <span class="s">'${"$"}{"{"${"$"}{"}"}'</span> <span class="o">+</span> <span class="n">delimiter</span><span class="p">.</span><span class="n">join</span><span class="p">(</span><span class="n">arr</span><span class="p">)</span> <span class="o">+</span> <span class="s">'${"$"}{"}"}'</span>


<span class="k">def</span> <span class="nf">Tags</span><span class="p">(</span><span class="n">tags</span><span class="p">):</span>
  <span class="n">tags</span> <span class="o">=</span> <span class="nb">map</span><span class="p">(</span><span class="k">lambda</span> <span class="n">tag</span><span class="p">:</span> <span class="n">Tag</span><span class="p">(</span><span class="n">tag</span><span class="p">),</span> <span class="n">tags</span><span class="p">)</span>
  <span class="n">arr</span> <span class="o">=</span> <span class="p">[]</span>
  <span class="k">for</span> <span class="n">tag</span> <span class="ow">in</span> <span class="n">tags</span><span class="p">:</span>
    <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="n">tag</span><span class="p">)</span>

  <span class="k">return</span> <span class="s">'['</span> <span class="o">+</span> <span class="s">','</span><span class="p">.</span><span class="n">join</span><span class="p">(</span><span class="n">arr</span><span class="p">)</span> <span class="o">+</span> <span class="s">']'</span>

<span class="k">def</span> <span class="nf">User</span><span class="p">(</span><span class="n">user</span><span class="p">:</span><span class="nb">dict</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="nb">str</span><span class="p">:</span>
  <span class="n">description</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'description'</span><span class="p">]</span>
  <span class="n">facebook_id</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'facebook_id'</span><span class="p">]</span>
  <span class="n">followees_count</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'followees_count'</span><span class="p">]</span>
  <span class="n">followers_count</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'followers_count'</span><span class="p">]</span>
  <span class="n">github_login_name</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'github_login_name'</span><span class="p">]</span>
  <span class="nb">id</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'id'</span><span class="p">]</span>
  <span class="n">items_count</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'items_count'</span><span class="p">]</span>
  <span class="n">linkedin_id</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'linkedin_id'</span><span class="p">]</span>
  <span class="n">location</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'location'</span><span class="p">]</span>
  <span class="n">name</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'name'</span><span class="p">]</span>
  <span class="n">organization</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'organization'</span><span class="p">]</span>
  <span class="n">permanent_id</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'permanent_id'</span><span class="p">]</span>
  <span class="n">profile_image_url</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'profile_image_url'</span><span class="p">]</span>
  <span class="n">team_only</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'team_only'</span><span class="p">]</span>
  <span class="n">twitter_screen_name</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'twitter_screen_name'</span><span class="p">]</span>
  <span class="n">website_url</span> <span class="o">=</span> <span class="n">user</span><span class="p">[</span><span class="s">'website_url'</span><span class="p">]</span>

  <span class="n">arr</span> <span class="o">=</span> <span class="p">[]</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'description: \`</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">description</span><span class="si">${"$"}{"}"}</span><span class="s">\`'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'facebook_id: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">facebook_id</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'followees_count: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">followees_count</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'followers_count: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">followers_count</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'github_login_name: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">github_login_name</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'id: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="nb">id</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'items_count: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">items_count</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'linkedin_id: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">linkedin_id</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'location: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">location</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'name: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">name</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'organization: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">organization</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'permanent_id: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">permanent_id</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'profile_image_url: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">profile_image_url</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'team_only: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="nb">str</span><span class="p">(</span><span class="n">team_only</span><span class="p">).</span><span class="n">lower</span><span class="p">()</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'twitter_screen_name: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">twitter_screen_name</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'website_url: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">website_url</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>

  <span class="k">return</span> <span class="s">'${"$"}{"{"${"$"}{"}"}'</span> <span class="o">+</span> <span class="s">','</span><span class="p">.</span><span class="n">join</span><span class="p">(</span><span class="n">arr</span><span class="p">)</span> <span class="o">+</span> <span class="s">'${"$"}{"}"}'</span>

<span class="k">def</span> <span class="nf">TeamMembership</span><span class="p">(</span><span class="n">tm</span><span class="p">:</span><span class="nb">dict</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="nb">str</span><span class="p">:</span>
  <span class="k">if</span><span class="p">(</span><span class="n">tm</span> <span class="ow">is</span> <span class="bp">None</span><span class="p">):</span>
    <span class="k">return</span> <span class="n">Empty</span><span class="p">()</span>

  <span class="n">arr</span> <span class="o">=</span> <span class="p">[]</span>
  <span class="n">name</span> <span class="o">=</span> <span class="n">tm</span><span class="p">[</span><span class="s">'name'</span><span class="p">]</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'name: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">name</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="k">return</span> <span class="s">'${"$"}{"{"${"$"}{"}"}'</span> <span class="o">+</span> <span class="s">','</span><span class="p">.</span><span class="n">join</span><span class="p">(</span><span class="n">arr</span><span class="p">)</span> <span class="o">+</span> <span class="s">'${"$"}{"}"}'</span>

<span class="k">def</span> <span class="nf">Item</span><span class="p">(</span><span class="n">item</span><span class="p">:</span><span class="nb">dict</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="nb">str</span><span class="p">:</span>
  <span class="n">arr</span> <span class="o">=</span> <span class="p">[]</span>
  <span class="n">rendered_body</span> <span class="o">=</span> <span class="n">escape</span><span class="p">(</span><span class="n">item</span><span class="p">[</span><span class="s">'rendered_body'</span><span class="p">])</span>
  <span class="n">body</span> <span class="o">=</span> <span class="n">escape</span><span class="p">(</span><span class="n">item</span><span class="p">[</span><span class="s">'body'</span><span class="p">])</span>
  <span class="n">coediting</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'coediting'</span><span class="p">]</span>
  <span class="n">comments_count</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'comments_count'</span><span class="p">]</span>
  <span class="n">created_at</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'created_at'</span><span class="p">]</span>
  <span class="n">group</span> <span class="o">=</span> <span class="n">Group</span><span class="p">(</span><span class="n">item</span><span class="p">[</span><span class="s">'group'</span><span class="p">])</span> <span class="k">if</span> <span class="s">'group'</span> <span class="ow">in</span> <span class="n">item</span> <span class="k">else</span> <span class="n">Empty</span><span class="p">()</span>
  <span class="nb">id</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'id'</span><span class="p">]</span>
  <span class="n">likes_count</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'likes_count'</span><span class="p">]</span>
  <span class="n">private</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'private'</span><span class="p">]</span>
  <span class="n">reactions_count</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'reactions_count'</span><span class="p">]</span>
  <span class="n">tags</span> <span class="o">=</span> <span class="n">Tags</span><span class="p">(</span><span class="n">item</span><span class="p">[</span><span class="s">'tags'</span><span class="p">])</span> <span class="k">if</span> <span class="s">'tags'</span> <span class="ow">in</span> <span class="n">item</span> <span class="k">else</span> <span class="s">'[]'</span>
  <span class="n">title</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'title'</span><span class="p">]</span>
  <span class="n">updated_at</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'updated_at'</span><span class="p">]</span>
  <span class="n">url</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'url'</span><span class="p">]</span>
  <span class="n">user</span> <span class="o">=</span> <span class="n">User</span><span class="p">(</span><span class="n">item</span><span class="p">[</span><span class="s">'user'</span><span class="p">])</span> <span class="k">if</span> <span class="s">'user'</span> <span class="ow">in</span> <span class="n">item</span> <span class="k">else</span> <span class="n">Empty</span><span class="p">()</span>
  <span class="n">page_views_count</span> <span class="o">=</span> <span class="n">item</span><span class="p">[</span><span class="s">'page_views_count'</span><span class="p">]</span>
  <span class="n">team_membership</span> <span class="o">=</span> <span class="n">TeamMembership</span><span class="p">(</span><span class="n">item</span><span class="p">[</span><span class="s">'team_membership'</span><span class="p">])</span> <span class="k">if</span> <span class="s">'team_membership'</span> <span class="ow">in</span> <span class="n">item</span> <span class="k">else</span> <span class="n">Empty</span><span class="p">()</span>

  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'rendered_body: \`</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">rendered_body</span><span class="si">${"$"}{"}"}</span><span class="s">\`'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'body: \`</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">body</span><span class="si">${"$"}{"}"}</span><span class="s">\`'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'coediting: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="nb">str</span><span class="p">(</span><span class="n">coediting</span><span class="p">).</span><span class="n">lower</span><span class="p">()</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'comments_count: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">comments_count</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'created_at: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">created_at</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'group: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">group</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'id: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="nb">id</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'likes_count: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">likes_count</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'private: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="nb">str</span><span class="p">(</span><span class="n">private</span><span class="p">).</span><span class="n">lower</span><span class="p">()</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'reactions_count: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">reactions_count</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'tags: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">tags</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'title: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">title</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'updated_at: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">updated_at</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'url: </span><span class="se">\\'</span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">url</span><span class="si">${"$"}{"}"}</span><span class="se">\\'</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'user: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">user</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'page_views_count: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="s">"null"</span> <span class="k">if</span> <span class="n">page_views_count</span> <span class="ow">is</span> <span class="bp">None</span> <span class="k">else</span> <span class="n">page_views_count</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>
  <span class="n">arr</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="sa">f</span><span class="s">'team_membership: </span><span class="si">${"$"}{"{"${"$"}{"}"}</span><span class="n">team_membership</span><span class="si">${"$"}{"}"}</span><span class="s">'</span><span class="p">)</span>

  <span class="k">return</span> <span class="s">'${"$"}{"{"${"$"}{"}"}'</span> <span class="o">+</span> <span class="s">','</span><span class="p">.</span><span class="n">join</span><span class="p">(</span><span class="n">arr</span><span class="p">)</span> <span class="o">+</span> <span class="s">'${"$"}{"}"}'</span>


<span class="k">def</span> <span class="nf">main</span><span class="p">(</span><span class="n">out_path</span><span class="p">):</span>

  <span class="n">response</span> <span class="o">=</span> <span class="n">requests</span><span class="p">.</span><span class="n">get</span><span class="p">(</span><span class="s">'https://qiita.com/api/v2/items?query=user:sYamaz'</span><span class="p">)</span>
  <span class="n">items</span> <span class="o">=</span> <span class="n">json</span><span class="p">.</span><span class="n">loads</span><span class="p">(</span><span class="n">response</span><span class="p">.</span><span class="n">text</span><span class="p">)</span>

  <span class="n">lines</span> <span class="o">=</span> <span class="p">[]</span>
  <span class="k">for</span> <span class="n">item</span> <span class="ow">in</span> <span class="n">items</span><span class="p">:</span>
    <span class="n">it</span> <span class="o">=</span> <span class="n">Item</span><span class="p">(</span><span class="n">item</span><span class="p">)</span>
    <span class="n">lines</span><span class="p">.</span><span class="n">append</span><span class="p">(</span><span class="n">it</span><span class="p">)</span>



  <span class="n">text</span> <span class="o">=</span> <span class="s">'export const articles = ['</span> <span class="o">+</span> <span class="s">','</span><span class="p">.</span><span class="n">join</span><span class="p">(</span><span class="n">lines</span><span class="p">)</span> <span class="o">+</span> <span class="s">']'</span>
  <span class="k">if</span> <span class="n">os</span><span class="p">.</span><span class="n">path</span><span class="p">.</span><span class="n">exists</span><span class="p">(</span><span class="n">os</span><span class="p">.</span><span class="n">path</span><span class="p">.</span><span class="n">dirname</span><span class="p">(</span><span class="n">out_path</span><span class="p">))</span> <span class="o">==</span> <span class="bp">False</span><span class="p">:</span>
    <span class="n">os</span><span class="p">.</span><span class="n">makedirs</span><span class="p">(</span><span class="n">os</span><span class="p">.</span><span class="n">path</span><span class="p">.</span><span class="n">dirname</span><span class="p">(</span><span class="n">out_path</span><span class="p">))</span>
  <span class="n">f</span> <span class="o">=</span> <span class="n">io</span><span class="p">.</span><span class="nb">open</span><span class="p">(</span><span class="n">out_path</span><span class="p">,</span> <span class="s">'w'</span><span class="p">)</span>
  <span class="n">f</span><span class="p">.</span><span class="n">write</span><span class="p">(</span><span class="n">text</span><span class="p">)</span>

<span class="k">if</span> <span class="n">__name__</span> <span class="o">==</span> <span class="s">'__main__'</span><span class="p">:</span>
  <span class="n">main</span><span class="p">(</span><span class="n">sys</span><span class="p">.</span><span class="n">argv</span><span class="p">[</span><span class="mi">1</span><span class="p">])</span>
</code></pre></div></div>
</div></details>
<h2 data-sourcepos="214:1-214:15">
<span id="終わりに" class="fragment"></span><a href="#%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AB"><i class="fa fa-link"></i></a>終わりに</h2>
<p data-sourcepos="216:1-216:112">pythonでQiitaApiから自分の記事一覧を取得、tsファイルを生成することができました。</p>
<p data-sourcepos="218:1-218:41">次はGithub Actionsと連携させて、</p>
<ul data-sourcepos="220:1-223:0">
<li data-sourcepos="220:1-220:49">日1回Apiから取得 → tsファイル生成</li>
<li data-sourcepos="221:1-221:14">コミット</li>
<li data-sourcepos="222:1-223:0">Github Pagesデプロイ</li>
</ul>
<p data-sourcepos="224:1-224:33">を目指そうと思います。</p>
`,body: `先日@nuxt/axiosを使ってQiitaApiから自分の記事一覧を取得しました

https://qiita.com/sYamaz/items/10c8c9db83e5dad62b90

ただ、この記事の最後に書いたようにスクリプトでコードを自動生成する方が目的に会っていると思っていたのでPythonでQiitaApiにアクセスしようと思います

### 環境

* Python 3.8.9
    * \`pip install requests\`

### スクリプト

\`requests\`パッケージを使用しApiから記事一覧を取得します。簡潔に書くと以下

\`\`\`python
import requests
import json

response = requests.get('https://qiita.com/api/v2/items?query=user:sYamaz')

items = json.loads(response.text)
for item in items:
  # item(=記事)ごとの処理

\`\`\`

この内容をもとにarticles.tsを出力できるようにします。

期待する内容

\`\`\`autogenerated/articles.ts
export const articles = [
  ${"$"}{"{"${"$"}{"}"}
    rendered_body: '........'
    body: '.......'
    ... 略
  ${"$"}{"}"},
  ${"$"}{"{"${"$"}{"}"} ... ${"$"}{"}"}
  ...略
]
\`\`\`

<details><summary>スクリプト全文（長いので折りたたみ）</summary><div>

\`\`\`python
import sys
import json
import io
import requests
import os

def escape(input:str) -> str:
  return input.replace('\\\\', '\\\\\\\\')\\
              .replace('\`', '\\\`')\\
              .replace('${"$"}{"{"${"$"}{"}"}', '${"$"}${"$"}{"{"${"$"}{"}"}"${"$"}{"{"${"$"}{"}"}"${"$"}{"}"}')\\
              .replace('${"$"}{"}"}', '${"$"}${"$"}{"{"${"$"}{"}"}"${"$"}{"}"}"${"$"}{"}"}')\\
              .replace('${"$"}', '${"$"}${"$"}{"{"${"$"}{"}"}"${"$"}"${"$"}{"}"}')

def Empty() -> str:
  return '${"$"}{"{"${"$"}{"}"} ${"$"}{"}"}'

def Group(grp:dict) -> str:
  if(grp is None):
    return Empty()

  created_at = grp['created_at']
  description = grp['description']
  name = grp['name']
  private = grp['private']
  updated_at = grp['updated_at']
  url_name = grp['url_name']

  arr = []
  arr.append(f'created_at: \\'${"$"}{"{"${"$"}{"}"}created_at${"$"}{"}"}\\'')
  arr.append(f'description: \\'${"$"}{"{"${"$"}{"}"}description${"$"}{"}"}\\'')
  arr.append(f'name: \\'${"$"}{"{"${"$"}{"}"}name${"$"}{"}"}\\'')
  arr.append(f'private: ${"$"}{"{"${"$"}{"}"}str(private).lower${"$"}{"}"}')
  arr.append(f'updated_at: \\'${"$"}{"{"${"$"}{"}"}updated_at${"$"}{"}"}\\'')
  arr.append(f'url_name: \\'${"$"}{"{"${"$"}{"}"}url_name${"$"}{"}"}\\'')
  return '${"$"}{"{"${"$"}{"}"}' + ',\\n'.join(arr) +  '${"$"}{"}"}'

def Tag(tag:dict):
  name = tag['name']
  versions = tag['versions']
  arr = []
  delimiter = ','
  arr.append(f'name: \\'${"$"}{"{"${"$"}{"}"}name${"$"}{"}"}\\'')
  vals = delimiter.join(map(lambda v: f'\\'${"$"}{"{"${"$"}{"}"}v${"$"}{"}"}\\'' ,versions))
  arr.append(f'versions: [ ${"$"}{"{"${"$"}{"}"}vals${"$"}{"}"} ]')
  return '${"$"}{"{"${"$"}{"}"}' + delimiter.join(arr) + '${"$"}{"}"}'


def Tags(tags):
  tags = map(lambda tag: Tag(tag), tags)
  arr = []
  for tag in tags:
    arr.append(tag)

  return '[' + ','.join(arr) + ']'

def User(user:dict) -> str:
  description = user['description']
  facebook_id = user['facebook_id']
  followees_count = user['followees_count']
  followers_count = user['followers_count']
  github_login_name = user['github_login_name']
  id = user['id']
  items_count = user['items_count']
  linkedin_id = user['linkedin_id']
  location = user['location']
  name = user['name']
  organization = user['organization']
  permanent_id = user['permanent_id']
  profile_image_url = user['profile_image_url']
  team_only = user['team_only']
  twitter_screen_name = user['twitter_screen_name']
  website_url = user['website_url']

  arr = []
  arr.append(f'description: \`${"$"}{"{"${"$"}{"}"}description${"$"}{"}"}\`')
  arr.append(f'facebook_id: \\'${"$"}{"{"${"$"}{"}"}facebook_id${"$"}{"}"}\\'')
  arr.append(f'followees_count: ${"$"}{"{"${"$"}{"}"}followees_count${"$"}{"}"}')
  arr.append(f'followers_count: ${"$"}{"{"${"$"}{"}"}followers_count${"$"}{"}"}')
  arr.append(f'github_login_name: \\'${"$"}{"{"${"$"}{"}"}github_login_name${"$"}{"}"}\\'')
  arr.append(f'id: \\'${"$"}{"{"${"$"}{"}"}id${"$"}{"}"}\\'')
  arr.append(f'items_count: ${"$"}{"{"${"$"}{"}"}items_count${"$"}{"}"}')
  arr.append(f'linkedin_id: \\'${"$"}{"{"${"$"}{"}"}linkedin_id${"$"}{"}"}\\'')
  arr.append(f'location: \\'${"$"}{"{"${"$"}{"}"}location${"$"}{"}"}\\'')
  arr.append(f'name: \\'${"$"}{"{"${"$"}{"}"}name${"$"}{"}"}\\'')
  arr.append(f'organization: \\'${"$"}{"{"${"$"}{"}"}organization${"$"}{"}"}\\'')
  arr.append(f'permanent_id: \\'${"$"}{"{"${"$"}{"}"}permanent_id${"$"}{"}"}\\'')
  arr.append(f'profile_image_url: \\'${"$"}{"{"${"$"}{"}"}profile_image_url${"$"}{"}"}\\'')
  arr.append(f'team_only: ${"$"}{"{"${"$"}{"}"}str(team_only).lower()${"$"}{"}"}')
  arr.append(f'twitter_screen_name: \\'${"$"}{"{"${"$"}{"}"}twitter_screen_name${"$"}{"}"}\\'')
  arr.append(f'website_url: \\'${"$"}{"{"${"$"}{"}"}website_url${"$"}{"}"}\\'')

  return '${"$"}{"{"${"$"}{"}"}' + ','.join(arr) + '${"$"}{"}"}'

def TeamMembership(tm:dict) -> str:
  if(tm is None):
    return Empty()

  arr = []
  name = tm['name']
  arr.append(f'name: \\'${"$"}{"{"${"$"}{"}"}name${"$"}{"}"}\\'')
  return '${"$"}{"{"${"$"}{"}"}' + ','.join(arr) + '${"$"}{"}"}'

def Item(item:dict) -> str:
  arr = []
  rendered_body = escape(item['rendered_body'])
  body = escape(item['body'])
  coediting = item['coediting']
  comments_count = item['comments_count']
  created_at = item['created_at']
  group = Group(item['group']) if 'group' in item else Empty()
  id = item['id']
  likes_count = item['likes_count']
  private = item['private']
  reactions_count = item['reactions_count']
  tags = Tags(item['tags']) if 'tags' in item else '[]'
  title = item['title']
  updated_at = item['updated_at']
  url = item['url']
  user = User(item['user']) if 'user' in item else Empty()
  page_views_count = item['page_views_count']
  team_membership = TeamMembership(item['team_membership']) if 'team_membership' in item else Empty()

  arr.append(f'rendered_body: \`${"$"}{"{"${"$"}{"}"}rendered_body${"$"}{"}"}\`')
  arr.append(f'body: \`${"$"}{"{"${"$"}{"}"}body${"$"}{"}"}\`')
  arr.append(f'coediting: ${"$"}{"{"${"$"}{"}"}str(coediting).lower()${"$"}{"}"}')
  arr.append(f'comments_count: ${"$"}{"{"${"$"}{"}"}comments_count${"$"}{"}"}')
  arr.append(f'created_at: \\'${"$"}{"{"${"$"}{"}"}created_at${"$"}{"}"}\\'')
  arr.append(f'group: \\'${"$"}{"{"${"$"}{"}"}group${"$"}{"}"}\\'')
  arr.append(f'id: \\'${"$"}{"{"${"$"}{"}"}id${"$"}{"}"}\\'')
  arr.append(f'likes_count: ${"$"}{"{"${"$"}{"}"}likes_count${"$"}{"}"}')
  arr.append(f'private: ${"$"}{"{"${"$"}{"}"}str(private).lower()${"$"}{"}"}')
  arr.append(f'reactions_count: ${"$"}{"{"${"$"}{"}"}reactions_count${"$"}{"}"}')
  arr.append(f'tags: ${"$"}{"{"${"$"}{"}"}tags${"$"}{"}"}')
  arr.append(f'title: \\'${"$"}{"{"${"$"}{"}"}title${"$"}{"}"}\\'')
  arr.append(f'updated_at: \\'${"$"}{"{"${"$"}{"}"}updated_at${"$"}{"}"}\\'')
  arr.append(f'url: \\'${"$"}{"{"${"$"}{"}"}url${"$"}{"}"}\\'')
  arr.append(f'user: ${"$"}{"{"${"$"}{"}"}user${"$"}{"}"}')
  arr.append(f'page_views_count: ${"$"}{"{"${"$"}{"}"}"null" if page_views_count is None else page_views_count${"$"}{"}"}')
  arr.append(f'team_membership: ${"$"}{"{"${"$"}{"}"}team_membership${"$"}{"}"}')

  return '${"$"}{"{"${"$"}{"}"}' + ','.join(arr) + '${"$"}{"}"}'


def main(out_path):

  response = requests.get('https://qiita.com/api/v2/items?query=user:sYamaz')
  items = json.loads(response.text)

  lines = []
  for item in items:
    it = Item(item)
    lines.append(it)



  text = 'export const articles = [' + ','.join(lines) + ']'
  if os.path.exists(os.path.dirname(out_path)) == False:
    os.makedirs(os.path.dirname(out_path))
  f = io.open(out_path, 'w')
  f.write(text)

if __name__ == '__main__':
  main(sys.argv[1])
\`\`\`

</div></details>

## 終わりに

pythonでQiitaApiから自分の記事一覧を取得、tsファイルを生成することができました。

次はGithub Actionsと連携させて、

* 日1回Apiから取得 → tsファイル生成
* コミット
* Github Pagesデプロイ

を目指そうと思います。
`,coediting: false,comments_count: 1,created_at: '2022-05-24T22:58:05+09:00',group: '{ }',id: '2e5facc0032ed0801a26',likes_count: 0,private: false,reactions_count: 0,tags: [{name: 'Python',versions: [  ]},{name: 'QiitaAPI',versions: [  ]},{name: 'Python3',versions: [  ]}],title: 'PythonでもQiitaApiから自分の記事一覧を取得したい',updated_at: '2022-05-29T18:02:01+09:00',url: 'https://qiita.com/sYamaz/items/2e5facc0032ed0801a26',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p data-sourcepos="1:1-2:238">GitHubpagesに自己紹介サイトを立てて少しずつ拡張しています。<br>
今回、サイトにQiita記事へのリンクを貼りたい、けどリンクをペタペタ貼るのもつまらないということで、QiitaApiから私が書いた記事を取得しサイトに表示することにしました。</p>
<h3 data-sourcepos="4:1-4:10">
<span id="準備" class="fragment"></span><a href="#%E6%BA%96%E5%82%99"><i class="fa fa-link"></i></a>準備</h3>
<div class="code-frame" data-lang="shell" data-sourcepos="6:1-8:3"><div class="highlight"><pre><code>yarn add @nuxtjs/axios
</code></pre></div></div>
<h2 data-sourcepos="10:1-10:29">
<span id="qiitaのpatを使用する" class="fragment"></span><a href="#qiita%E3%81%AEpat%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B"><i class="fa fa-link"></i></a>QiitaのPATを使用する</h2>
<p data-sourcepos="12:1-14:51">Qiitaの設定でPATを生成、axiosのヘッダーに登録します。<br>
ここではQiitaApiクラスを作成し、<code>asyncData(ctx:Context)</code>などで使用できるようにします。<br>
（ここでは型定義の紹介は省きます）</p>
<div class="code-frame" data-lang="typescript" data-sourcepos="16:1-54:3">
<div class="code-lang"><span class="bold">~/plugins/apiPlugins.ts</span></div>
<div class="highlight"><pre><code><span class="k">import</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="nx">Plugin</span> <span class="p">${"$"}{"}"}</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">@nuxt/types</span><span class="dl">'</span>
<span class="k">import</span> <span class="nx">QiitaApi</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">~/api/QiitaApi</span><span class="dl">'</span>
<span class="k">import</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="nx">QiitaApi</span> <span class="k">as</span> <span class="nx">MockApi</span> <span class="p">${"$"}{"}"}</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">~/mock/QiitaApi</span><span class="dl">'</span> <span class="c1">// テストとかではモックに切り替えたい願望</span>
<span class="k">import</span> <span class="nx">IApi</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">~/types/Qiita/Api/v2/IApi</span><span class="dl">'</span>

<span class="c1">// vueインスタンスから${"$"}qiitaApiを使用可能にする</span>
<span class="kr">declare</span> <span class="kr">module</span> <span class="dl">'</span><span class="s1">vue/types/vue</span><span class="dl">'</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="kr">interface</span> <span class="nx">Vue</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="nl">${"$"}qiitaApi</span><span class="p">:</span> <span class="nx">IApi</span>
  <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>

<span class="c1">// this.${"$"}nuxt.contextから${"$"}qiitaApiを使用可能にする</span>
<span class="kr">declare</span> <span class="kr">module</span> <span class="dl">'</span><span class="s1">@nuxt/types</span><span class="dl">'</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="kr">interface</span> <span class="nx">NuxtAppOptions</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="nl">${"$"}qiitaApi</span><span class="p">:</span> <span class="nx">IApi</span>
  <span class="p">${"$"}{"}"}</span>

  <span class="kr">interface</span> <span class="nx">Context</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="nl">${"$"}qiitaApi</span><span class="p">:</span> <span class="nx">IApi</span>
  <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>

<span class="k">export</span> <span class="kd">const</span> <span class="nx">apiPlugin</span><span class="p">:</span> <span class="nx">Plugin</span> <span class="o">=</span> <span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">inject</span><span class="p">):</span> <span class="k">void</span> <span class="o">=&gt;</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="kd">const</span> <span class="nx">qiitaAxios</span> <span class="o">=</span> <span class="nx">context</span><span class="p">.</span><span class="nx">${"$"}axios</span><span class="p">.</span><span class="nx">create</span><span class="p">(${"$"}{"{"${"$"}{"}"}</span>
    <span class="c1">// baseURL: context.${"$"}config.baseURL</span>
    <span class="na">baseURL</span><span class="p">:</span> <span class="dl">'</span><span class="s1">https://qiita.com/api/v2/</span><span class="dl">'</span><span class="p">,</span>
    <span class="na">headers</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> 
      <span class="c1">// 環境変数に設定したQiita PATを登録</span>
      <span class="na">Authorization</span><span class="p">:</span> <span class="dl">'</span><span class="s1">Bearer </span><span class="dl">'</span> <span class="o">+</span> <span class="nx">process</span><span class="p">.</span><span class="nx">env</span><span class="p">.</span><span class="nx">PAT</span>
    <span class="p">${"$"}{"}"}</span>
  <span class="p">${"$"}{"}"})</span>

  <span class="nx">inject</span><span class="p">(</span><span class="dl">'</span><span class="s1">qiitaApi</span><span class="dl">'</span><span class="p">,</span> <span class="k">new</span> <span class="nx">QiitaApi</span><span class="p">(</span><span class="nx">qiitaAxios</span><span class="p">))</span>
<span class="p">${"$"}{"}"}</span>

<span class="k">export</span> <span class="k">default</span> <span class="nx">apiPlugin</span>
</code></pre></div>
</div>
<p data-sourcepos="56:1-56:128"><code>GET /api/v2/authenticated_user/items</code>を使用することで、PATを設定したユーザーの記事を取得できます。</p>
<div class="code-frame" data-lang="typescript" data-sourcepos="58:1-80:3">
<div class="code-lang"><span class="bold">~/api/QiitaApi.ts</span></div>
<div class="highlight"><pre><code><span class="k">import</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="nx">NuxtAxiosInstance</span> <span class="p">${"$"}{"}"}</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">@nuxtjs/axios</span><span class="dl">'</span>
<span class="k">import</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="nx">PostData</span> <span class="p">${"$"}{"}"}</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">~/types/Qiita/Api/v2/datas</span><span class="dl">'</span>
<span class="k">import</span> <span class="nx">IApi</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">~/types/Qiita/Api/v2/IApi</span><span class="dl">'</span>

<span class="k">export</span> <span class="k">default</span> <span class="kd">class</span> <span class="nx">QiitaApi</span> <span class="k">implements</span> <span class="nx">IApi</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="k">private</span> <span class="k">readonly</span> <span class="nx">axios</span><span class="p">:</span> <span class="nx">NuxtAxiosInstance</span>

  <span class="kd">constructor</span> <span class="p">(</span><span class="nx">axios</span><span class="p">:</span> <span class="nx">NuxtAxiosInstance</span><span class="p">)</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">this</span><span class="p">.</span><span class="nx">axios</span> <span class="o">=</span> <span class="nx">axios</span>
  <span class="p">${"$"}{"}"}</span>

  <span class="k">public</span> <span class="k">async</span> <span class="nx">getMyQiitaItems</span> <span class="p">():</span> <span class="nb">Promise</span><span class="o">&lt;</span><span class="nx">PostData</span><span class="p">[]</span><span class="o">&gt;</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
     <span class="kd">const</span> <span class="nx">url</span> <span class="o">=</span> <span class="dl">'</span><span class="s1">authenticated_user/items</span><span class="dl">'</span>
     <span class="k">try</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
       <span class="kd">const</span> <span class="na">response</span> <span class="p">:</span> <span class="nx">PostData</span><span class="p">[]</span> <span class="o">=</span> <span class="k">await</span> <span class="k">this</span><span class="p">.</span><span class="nx">axios</span><span class="p">.</span><span class="nx">${"$"}get</span><span class="p">(</span><span class="nx">url</span><span class="p">)</span>
       <span class="k">return</span> <span class="nx">response</span>
     <span class="p">${"$"}{"}"}</span> <span class="k">catch</span> <span class="p">(</span><span class="nx">e</span><span class="p">)</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
       <span class="k">return</span> <span class="nb">Promise</span><span class="p">.</span><span class="nx">reject</span><span class="p">(</span><span class="nx">e</span><span class="p">)</span>
     <span class="p">${"$"}{"}"}</span>
  <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div>
</div>
<p data-sourcepos="82:1-82:39">APIから取得する記事のタイプ</p>
<div class="code-frame" data-lang="typescript" data-sourcepos="84:1-125:3">
<div class="code-lang"><span class="bold">~/types/Qiita/Api/v2/datas.d.ts</span></div>
<div class="highlight"><pre><code><span class="cm">/**
 * 投稿データ
 * https://qiita.com/api/v2/docs#%E6%8A%95%E7%A8%BF
 * */</span>
<span class="k">export</span> <span class="kr">interface</span> <span class="nx">PostData</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="cm">/** HTML形式の本文 */</span>
  <span class="nl">rendered_body</span><span class="p">:</span><span class="kr">string</span>
  <span class="cm">/** Markdown形式の本文 */</span>
  <span class="nx">body</span><span class="p">:</span><span class="kr">string</span>
  <span class="cm">/** この記事が共同更新状態かどうか (Qiita Teamでのみ有効) */</span>
  <span class="nx">coediting</span><span class="p">:</span><span class="nx">boolean</span>
  <span class="cm">/** この記事へのコメントの数 */</span>
  <span class="nx">comments_count</span><span class="p">:</span><span class="kr">number</span>
  <span class="cm">/** データが作成された日時 */</span>
  <span class="nx">created_at</span><span class="p">:</span><span class="kr">string</span>
  <span class="cm">/** Qiita Teamのグループを表します。 */</span>
  <span class="nx">group</span><span class="p">:</span><span class="kr">any</span>
  <span class="cm">/** 記事の一意なID */</span>
  <span class="nx">id</span><span class="p">:</span><span class="kr">string</span>
  <span class="cm">/** この記事への「LGTM！」の数（Qiitaでのみ有効） */</span>
  <span class="nx">likes_count</span><span class="p">:</span><span class="kr">number</span>
  <span class="cm">/** 限定共有状態かどうかを表すフラグ (Qiita Teamでは無効) */</span>
  <span class="k">private</span><span class="p">:</span><span class="nx">boolean</span>
  <span class="cm">/** 絵文字リアクションの数（Qiita Teamでのみ有効） */</span>
  <span class="nx">reactions_count</span><span class="p">:</span><span class="kr">number</span>
  <span class="cm">/** 記事に付いたタグ一覧 */</span>
  <span class="nx">tags</span><span class="p">:</span><span class="kr">any</span>
  <span class="cm">/** 記事のタイトル */</span>
  <span class="nx">title</span><span class="p">:</span><span class="kr">string</span>
  <span class="cm">/** データが最後に更新された日時 */</span>
  <span class="nx">updated_at</span><span class="p">:</span><span class="kr">string</span>
  <span class="cm">/** Qiita上のユーザー情報 */</span>
  <span class="nx">user</span><span class="p">:</span> <span class="kr">any</span>
  <span class="cm">/** 記事のurl */</span>
  <span class="nx">url</span><span class="p">:</span><span class="kr">string</span>
  <span class="cm">/** Qiita上のユーザーを表します。 */</span>
  <span class="nx">page_views_count</span><span class="p">:</span><span class="kr">number</span> <span class="o">|</span> <span class="kc">undefined</span>
  <span class="cm">/** Qiita Teamのチームメンバー情報を表します */</span>
  <span class="nx">team_membership</span><span class="p">:</span> <span class="kr">any</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div>
</div>
<h2 data-sourcepos="127:1-127:32">
<span id="qiitaのpatを使用しない" class="fragment"></span><a href="#qiita%E3%81%AEpat%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84"><i class="fa fa-link"></i></a>QiitaのPATを使用しない</h2>
<p data-sourcepos="129:1-129:301">publicリポジトリでGithub pages使うとenvファイルに書いたPATが丸見えになってしまうので他の方法を考えます。（もしかしたらGithubのsecretsなどをうまく使用する方法があるのかもしれませんが、現状思い浮かばなかったので...）</p>
<p data-sourcepos="131:1-132:155"><code>GET /api/v2/items</code>で取得します。<br>
まだ、大した記事数ではないので<code>page</code>や<code>per_page</code>パラメータは使用せず、検索クエリパラメータ<code>query</code>のみ使用します</p>
<div class="code-frame" data-lang="typescript" data-sourcepos="134:1-160:3">
<div class="code-lang"><span class="bold">~/api/QiitaApi.ts</span></div>
<div class="highlight"><pre><code><span class="k">import</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="nx">NuxtAxiosInstance</span> <span class="p">${"$"}{"}"}</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">@nuxtjs/axios</span><span class="dl">'</span>
<span class="k">import</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="nx">PostData</span> <span class="p">${"$"}{"}"}</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">~/types/Qiita/Api/v2/datas</span><span class="dl">'</span>
<span class="k">import</span> <span class="nx">IApi</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">~/types/Qiita/Api/v2/IApi</span><span class="dl">'</span>

<span class="k">export</span> <span class="k">default</span> <span class="kd">class</span> <span class="nx">QiitaApi</span> <span class="k">implements</span> <span class="nx">IApi</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
  <span class="k">private</span> <span class="k">readonly</span> <span class="nx">axios</span><span class="p">:</span> <span class="nx">NuxtAxiosInstance</span>

  <span class="kd">constructor</span> <span class="p">(</span><span class="nx">axios</span><span class="p">:</span> <span class="nx">NuxtAxiosInstance</span><span class="p">)</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">this</span><span class="p">.</span><span class="nx">axios</span> <span class="o">=</span> <span class="nx">axios</span>
  <span class="p">${"$"}{"}"}</span>

  <span class="k">public</span> <span class="k">async</span> <span class="nx">getMyQiitaItems</span> <span class="p">():</span> <span class="nb">Promise</span><span class="o">&lt;</span><span class="nx">PostData</span><span class="p">[]</span><span class="o">&gt;</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">const</span> <span class="nx">url</span> <span class="o">=</span> <span class="dl">'</span><span class="s1">items</span><span class="dl">'</span>
    <span class="k">try</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
      <span class="kd">const</span> <span class="na">response</span><span class="p">:</span> <span class="nx">PostData</span><span class="p">[]</span> <span class="o">=</span> <span class="k">await</span> <span class="k">this</span><span class="p">.</span><span class="nx">axios</span><span class="p">.</span><span class="nx">${"$"}get</span><span class="p">(</span><span class="nx">url</span><span class="p">,</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="na">params</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
          <span class="na">query</span><span class="p">:</span> <span class="dl">'</span><span class="s1">user:sYamaz</span><span class="dl">'</span><span class="c1">//ユーザー名でフィルタリング</span>
        <span class="p">${"$"}{"}"}</span>
      <span class="p">${"$"}{"}"})</span>
      <span class="k">return</span> <span class="nx">response</span>
    <span class="p">${"$"}{"}"}</span> <span class="k">catch</span> <span class="p">(</span><span class="nx">e</span><span class="p">)</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
      <span class="k">return</span> <span class="nb">Promise</span><span class="p">.</span><span class="nx">reject</span><span class="p">(</span><span class="nx">e</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>
  <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div>
</div>
<h2 data-sourcepos="162:1-162:15">
<span id="終わりに" class="fragment"></span><a href="#%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AB"><i class="fa fa-link"></i></a>終わりに</h2>
<p data-sourcepos="164:1-164:117"><code>@nuxt/axios</code>を使ってQiitaApiにアクセスし、自分の記事一覧を取得することができました。</p>
<p data-sourcepos="166:1-166:326">ただし、使用制限（認証あり：1000回/時、認証なし：60回/時）があったり、記事自体そこまで頻繁に更新するものでもないことから、今回のような目的の場合はスクリプトなどでコードを自動生成するような方法の方が適していると思います。</p>
<p data-sourcepos="168:1-168:170">Github Actionを使って定期的にApiアクセス＆コード自動生成→コミット/マージ→Github Pagesにデプロイとかできると面白そうです。</p>
<hr data-sourcepos="170:1-170:3">
<p data-sourcepos="171:1-171:15">参考リンク</p>
<ul data-sourcepos="173:1-175:0">
<li data-sourcepos="173:1-173:66"><a href="https://qiita.com/api/v2/docs">Qiita Api v2 ドキュメント</a></li>
<li data-sourcepos="174:1-175:0"><a href="https://axios.nuxtjs.org/extend#new-axios-instance" rel="nofollow noopener" target="_blank">axios.nuxtjs.org</a></li>
</ul>
<p data-sourcepos="176:1-176:21">自己紹介サイト</p>
<ul data-sourcepos="178:1-178:82">
<li data-sourcepos="178:1-178:82"><a href="https://syamaz.github.io/website-nuxt/" rel="nofollow noopener" target="_blank">https://syamaz.github.io/website-nuxt/</a></li>
</ul>
`,body: `GitHubpagesに自己紹介サイトを立てて少しずつ拡張しています。
今回、サイトにQiita記事へのリンクを貼りたい、けどリンクをペタペタ貼るのもつまらないということで、QiitaApiから私が書いた記事を取得しサイトに表示することにしました。

### 準備

\`\`\`shell
yarn add @nuxtjs/axios
\`\`\`

## QiitaのPATを使用する

Qiitaの設定でPATを生成、axiosのヘッダーに登録します。
ここではQiitaApiクラスを作成し、\`asyncData(ctx:Context)\`などで使用できるようにします。
（ここでは型定義の紹介は省きます）

\`\`\`~/plugins/apiPlugins.ts
import ${"$"}{"{"${"$"}{"}"} Plugin ${"$"}{"}"} from '@nuxt/types'
import QiitaApi from '~/api/QiitaApi'
import ${"$"}{"{"${"$"}{"}"} QiitaApi as MockApi ${"$"}{"}"} from '~/mock/QiitaApi' // テストとかではモックに切り替えたい願望
import IApi from '~/types/Qiita/Api/v2/IApi'

// vueインスタンスから${"$"}qiitaApiを使用可能にする
declare module 'vue/types/vue' ${"$"}{"{"${"$"}{"}"}
  interface Vue ${"$"}{"{"${"$"}{"}"}
    ${"$"}qiitaApi: IApi
  ${"$"}{"}"}
${"$"}{"}"}

// this.${"$"}nuxt.contextから${"$"}qiitaApiを使用可能にする
declare module '@nuxt/types' ${"$"}{"{"${"$"}{"}"}
  interface NuxtAppOptions ${"$"}{"{"${"$"}{"}"}
    ${"$"}qiitaApi: IApi
  ${"$"}{"}"}

  interface Context ${"$"}{"{"${"$"}{"}"}
    ${"$"}qiitaApi: IApi
  ${"$"}{"}"}
${"$"}{"}"}

export const apiPlugin: Plugin = (context, inject): void => ${"$"}{"{"${"$"}{"}"}
  const qiitaAxios = context.${"$"}axios.create(${"$"}{"{"${"$"}{"}"}
    // baseURL: context.${"$"}config.baseURL
    baseURL: 'https://qiita.com/api/v2/',
    headers: ${"$"}{"{"${"$"}{"}"} 
      // 環境変数に設定したQiita PATを登録
      Authorization: 'Bearer ' + process.env.PAT
    ${"$"}{"}"}
  ${"$"}{"}"})

  inject('qiitaApi', new QiitaApi(qiitaAxios))
${"$"}{"}"}

export default apiPlugin
\`\`\`

\`GET /api/v2/authenticated_user/items\`を使用することで、PATを設定したユーザーの記事を取得できます。

\`\`\`~/api/QiitaApi.ts
import ${"$"}{"{"${"$"}{"}"} NuxtAxiosInstance ${"$"}{"}"} from '@nuxtjs/axios'
import ${"$"}{"{"${"$"}{"}"} PostData ${"$"}{"}"} from '~/types/Qiita/Api/v2/datas'
import IApi from '~/types/Qiita/Api/v2/IApi'

export default class QiitaApi implements IApi ${"$"}{"{"${"$"}{"}"}
  private readonly axios: NuxtAxiosInstance

  constructor (axios: NuxtAxiosInstance) ${"$"}{"{"${"$"}{"}"}
    this.axios = axios
  ${"$"}{"}"}

  public async getMyQiitaItems (): Promise<PostData[]> ${"$"}{"{"${"$"}{"}"}
     const url = 'authenticated_user/items'
     try ${"$"}{"{"${"$"}{"}"}
       const response : PostData[] = await this.axios.${"$"}get(url)
       return response
     ${"$"}{"}"} catch (e) ${"$"}{"{"${"$"}{"}"}
       return Promise.reject(e)
     ${"$"}{"}"}
  ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

APIから取得する記事のタイプ

\`\`\`~/types/Qiita/Api/v2/datas.d.ts
/**
 * 投稿データ
 * https://qiita.com/api/v2/docs#%E6%8A%95%E7%A8%BF
 * */
export interface PostData${"$"}{"{"${"$"}{"}"}
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
  tags:any
  /** 記事のタイトル */
  title:string
  /** データが最後に更新された日時 */
  updated_at:string
  /** Qiita上のユーザー情報 */
  user: any
  /** 記事のurl */
  url:string
  /** Qiita上のユーザーを表します。 */
  page_views_count:number | undefined
  /** Qiita Teamのチームメンバー情報を表します */
  team_membership: any
${"$"}{"}"}
\`\`\`

## QiitaのPATを使用しない

publicリポジトリでGithub pages使うとenvファイルに書いたPATが丸見えになってしまうので他の方法を考えます。（もしかしたらGithubのsecretsなどをうまく使用する方法があるのかもしれませんが、現状思い浮かばなかったので...）

\`GET /api/v2/items\`で取得します。
まだ、大した記事数ではないので\`page\`や\`per_page\`パラメータは使用せず、検索クエリパラメータ\`query\`のみ使用します

\`\`\`~/api/QiitaApi.ts
import ${"$"}{"{"${"$"}{"}"} NuxtAxiosInstance ${"$"}{"}"} from '@nuxtjs/axios'
import ${"$"}{"{"${"$"}{"}"} PostData ${"$"}{"}"} from '~/types/Qiita/Api/v2/datas'
import IApi from '~/types/Qiita/Api/v2/IApi'

export default class QiitaApi implements IApi ${"$"}{"{"${"$"}{"}"}
  private readonly axios: NuxtAxiosInstance

  constructor (axios: NuxtAxiosInstance) ${"$"}{"{"${"$"}{"}"}
    this.axios = axios
  ${"$"}{"}"}

  public async getMyQiitaItems (): Promise<PostData[]> ${"$"}{"{"${"$"}{"}"}
    const url = 'items'
    try ${"$"}{"{"${"$"}{"}"}
      const response: PostData[] = await this.axios.${"$"}get(url, ${"$"}{"{"${"$"}{"}"}
        params: ${"$"}{"{"${"$"}{"}"}
          query: 'user:sYamaz'//ユーザー名でフィルタリング
        ${"$"}{"}"}
      ${"$"}{"}"})
      return response
    ${"$"}{"}"} catch (e) ${"$"}{"{"${"$"}{"}"}
      return Promise.reject(e)
    ${"$"}{"}"}
  ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

## 終わりに

\`@nuxt/axios\`を使ってQiitaApiにアクセスし、自分の記事一覧を取得することができました。

ただし、使用制限（認証あり：1000回/時、認証なし：60回/時）があったり、記事自体そこまで頻繁に更新するものでもないことから、今回のような目的の場合はスクリプトなどでコードを自動生成するような方法の方が適していると思います。

Github Actionを使って定期的にApiアクセス＆コード自動生成→コミット/マージ→Github Pagesにデプロイとかできると面白そうです。

---
参考リンク

* [Qiita Api v2 ドキュメント](https://qiita.com/api/v2/docs)
* [axios.nuxtjs.org](https://axios.nuxtjs.org/extend#new-axios-instance)

自己紹介サイト

* [https://syamaz.github.io/website-nuxt/](https://syamaz.github.io/website-nuxt/)
`,coediting: false,comments_count: 0,created_at: '2022-05-23T22:46:08+09:00',group: '{ }',id: '10c8c9db83e5dad62b90',likes_count: 2,private: false,reactions_count: 0,tags: [{name: 'QiitaAPI',versions: [  ]},{name: 'Vue.js',versions: [  ]},{name: 'axios',versions: [  ]},{name: 'Nuxt',versions: [  ]}],title: '@nuxt/axiosを使ってQiita Apiから記事一覧を取得する',updated_at: '2022-05-23T22:46:08+09:00',url: 'https://qiita.com/sYamaz/items/10c8c9db83e5dad62b90',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p data-sourcepos="1:1-1:66">2022年5月2日に初めてアプリをリリースしました。</p>
<p data-sourcepos="3:1-3:147">今回は提出からリリースに至るまでの審査の過程やリジェクト内容などをサクッと共有できればと思います。</p>
<h2 data-sourcepos="5:1-5:38">
<span id="2021年12月15日アプリ提出" class="fragment"></span><a href="#2021%E5%B9%B412%E6%9C%8815%E6%97%A5%E3%82%A2%E3%83%97%E3%83%AA%E6%8F%90%E5%87%BA"><i class="fa fa-link"></i></a>2021年12月15日：アプリ提出</h2>
<p data-sourcepos="7:1-8:60">App Store Connectの審査に自作アプリを提出しました。<br>
私としてはこれが初めての経験となります。</p>
<h2 data-sourcepos="10:1-10:47">
<span id="2021年12月20日in-review状態になる" class="fragment"></span><a href="#2021%E5%B9%B412%E6%9C%8820%E6%97%A5in-review%E7%8A%B6%E6%85%8B%E3%81%AB%E3%81%AA%E3%82%8B"><i class="fa fa-link"></i></a>2021年12月20日：In Review状態になる</h2>
<p data-sourcepos="12:1-12:108">休日を除けば提出してから２〜３日経過してレビューが開始されたようでした。</p>
<p data-sourcepos="14:1-14:204">思ったよりレビュー開始までに時間かかったなと思いましたが、個人開発で特に切羽詰まっているものでもなかったので気長に待つつもりでいました。</p>
<h2 data-sourcepos="16:1-16:56">
<span id="2021年12月20日謎のリジェクトを受ける" class="fragment"></span><a href="#2021%E5%B9%B412%E6%9C%8820%E6%97%A5%E8%AC%8E%E3%81%AE%E3%83%AA%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%92%E5%8F%97%E3%81%91%E3%82%8B"><i class="fa fa-link"></i></a>2021年12月20日：謎のリジェクトを受ける</h2>
<blockquote data-sourcepos="18:1-28:25">
<p data-sourcepos="18:3-18:8">Hello,</p>
<p data-sourcepos="20:3-20:135">The review of your app is taking longer than expected. Once we &gt; have completed our review, we will notify you via Resolution Center.</p>
<p data-sourcepos="22:3-22:127">If you would like to inquire about the status of this review, you may file a request via the Apple Developer Contact Us page.</p>
<p data-sourcepos="24:3-24:15">Best regards,</p>
<p data-sourcepos="26:3-26:18">App Store Review</p>
<p data-sourcepos="28:3-28:25">却下の理由：Other</p>
</blockquote>
<p data-sourcepos="30:1-30:102">意訳：予想より時間かかっています。レビュー終わったらお知らせします。</p>
<p data-sourcepos="32:1-32:195">ということで、ステータスはリジェクトでしたが、こちらから何かアクションを起こさなくても良さそうだったのでそのまま放置していました。</p>
<h2 data-sourcepos="34:1-34:52">
<span id="2022年3月29日再びin-review状態になる" class="fragment"></span><a href="#2022%E5%B9%B43%E6%9C%8829%E6%97%A5%E5%86%8D%E3%81%B3in-review%E7%8A%B6%E6%85%8B%E3%81%AB%E3%81%AA%E3%82%8B"><i class="fa fa-link"></i></a>2022年3月29日：再びIn Review状態になる</h2>
<p data-sourcepos="36:1-36:87">忘れた頃、実に約３ヶ月ぶりに唐突にレビューが再開されました</p>
<h2 data-sourcepos="38:1-38:37">
<span id="2022年3月29日リジェクト" class="fragment"></span><a href="#2022%E5%B9%B43%E6%9C%8829%E6%97%A5%E3%83%AA%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88"><i class="fa fa-link"></i></a>2022年3月29日：リジェクト</h2>
<p data-sourcepos="40:1-40:67">却下の理由は<code>Guideline 2.3 - Performance - Accurate Metadata</code></p>
<p data-sourcepos="42:1-42:160">前回の、<code>却下の理由：Other</code>と違ってこの時はアプリに問題があってのリジェクトだったので対応する必要があります。</p>
<h2 data-sourcepos="44:1-44:30">
<span id="2022年5月2日再審査" class="fragment"></span><a href="#2022%E5%B9%B45%E6%9C%882%E6%97%A5%E5%86%8D%E5%AF%A9%E6%9F%BB"><i class="fa fa-link"></i></a>2022年5月2日：再審査</h2>
<p data-sourcepos="46:1-46:206">上記の却下の理由は、"ライトモードとダークモードのスクリーンショットを提出しているがアプリ本体にテーマ切り替えの機能はない"ことのようです。</p>
<p data-sourcepos="48:1-48:261">システムのテーマに合わせてアプリのテーマも切り替わるようにはなっていたのですが、どうやらそれだけでは足りないみたいです（ここの確証が得られる情報をまだ見つけられていません）。</p>
<p data-sourcepos="50:1-50:174">今回はテーマにこだわりはなかったのでライトモードのスクリーンショットのみに差し替えたところ即日審査通過となりました。</p>
<p data-sourcepos="52:1-52:166">対応自体は1日で終わりましたが、プライベートがバタバタしていたのでリジェクトから約１ヶ月後の再提出となりました。</p>
<hr data-sourcepos="54:1-55:0">
<p data-sourcepos="56:1-56:33">そのアプリ（iPhoneのみ）</p>
<p data-sourcepos="58:1-58:54"><qiita-embed-ogp src="https://apps.apple.com/jp/app/routinetree/id1600469504"></qiita-embed-ogp></p>
`,body: `2022年5月2日に初めてアプリをリリースしました。

今回は提出からリリースに至るまでの審査の過程やリジェクト内容などをサクッと共有できればと思います。

## 2021年12月15日：アプリ提出

App Store Connectの審査に自作アプリを提出しました。
私としてはこれが初めての経験となります。

## 2021年12月20日：In Review状態になる

休日を除けば提出してから２〜３日経過してレビューが開始されたようでした。

思ったよりレビュー開始までに時間かかったなと思いましたが、個人開発で特に切羽詰まっているものでもなかったので気長に待つつもりでいました。

## 2021年12月20日：謎のリジェクトを受ける

> Hello,
> 
> The review of your app is taking longer than expected. Once we > have completed our review, we will notify you via Resolution Center.
>
> If you would like to inquire about the status of this review, you may file a request via the Apple Developer Contact Us page.
>
> Best regards,
>
> App Store Review
>
> 却下の理由：Other

意訳：予想より時間かかっています。レビュー終わったらお知らせします。

ということで、ステータスはリジェクトでしたが、こちらから何かアクションを起こさなくても良さそうだったのでそのまま放置していました。

## 2022年3月29日：再びIn Review状態になる

忘れた頃、実に約３ヶ月ぶりに唐突にレビューが再開されました

## 2022年3月29日：リジェクト

却下の理由は\`Guideline 2.3 - Performance - Accurate Metadata\`

前回の、\`却下の理由：Other\`と違ってこの時はアプリに問題があってのリジェクトだったので対応する必要があります。

## 2022年5月2日：再審査

上記の却下の理由は、"ライトモードとダークモードのスクリーンショットを提出しているがアプリ本体にテーマ切り替えの機能はない"ことのようです。

システムのテーマに合わせてアプリのテーマも切り替わるようにはなっていたのですが、どうやらそれだけでは足りないみたいです（ここの確証が得られる情報をまだ見つけられていません）。

今回はテーマにこだわりはなかったのでライトモードのスクリーンショットのみに差し替えたところ即日審査通過となりました。

対応自体は1日で終わりましたが、プライベートがバタバタしていたのでリジェクトから約１ヶ月後の再提出となりました。

---

そのアプリ（iPhoneのみ）

https://apps.apple.com/jp/app/routinetree/id1600469504
`,coediting: false,comments_count: 0,created_at: '2022-05-11T21:35:51+09:00',group: '{ }',id: '6f6985cc71cd96dfdb4f',likes_count: 0,private: false,reactions_count: 0,tags: [{name: 'AppStore',versions: [  ]},{name: 'AppStoreConnect',versions: [  ]}],title: '初めてAppStoreにアプリを出した話（ほぼ日記）',updated_at: '2022-05-11T21:35:51+09:00',url: 'https://qiita.com/sYamaz/items/6f6985cc71cd96dfdb4f',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>タイトルの通りのことをやってみました。</p>

<p>結論から言うと、Blazorをやっているとvueの学習コストが下がるので「dotnetしかやったことないよ！」という人にはVueはお勧めできるかと思います。</p>

<p>Blazorで作った話はこちら↓</p>

<ul>
<li><a href="https://qiita.com/sYamaz/items/d0b12043f5b25a36d8e6" id="reference-c26eddef344ca9780a75">BlazorでSkclusive-UIを使った話</a></li>
<li>ページ：<a href="https://syamaz.github.io/website/" class="autolink" rel="nofollow noopener" target="_blank">https://syamaz.github.io/website/</a>
</li>
</ul>

<p>今回作ったものはこちら↓</p>

<ul>
<li>ページ：<a href="https://syamaz.github.io/website-vue/" class="autolink" rel="nofollow noopener" target="_blank">https://syamaz.github.io/website-vue/</a>
</li>
</ul>

<h2>
<span id="環境" class="fragment"></span><a href="#%E7%92%B0%E5%A2%83"><i class="fa fa-link"></i></a>環境</h2>

<ul>
<li>Vue3</li>
<li>Vue-router@4</li>
<li>Vuetify 3.0.0-alpha</li>
<li>Vite</li>
<li>gh-pages</li>
</ul>

<h2>
<span id="vueコンポーネントとrazorコンポーネント" class="fragment"></span><a href="#vue%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%A8razor%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88"><i class="fa fa-link"></i></a>vueコンポーネントとrazorコンポーネント</h2>

<p>コンポーネントにはスタイル、テンプレート（UI）、スクリプトが含まれるという点でvueコンポーネントとrazorコンポーネントはほぼ同じ役割を持たせることができます</p>

<p>以下、Materialデザインの「カード」を列挙するページについてのコンポーネントです。</p>

<h5>
<span id="vue" class="fragment"></span><a href="#vue"><i class="fa fa-link"></i></a>vue</h5>

<p><qiita-embed-ogp src="https://github.com/sYamaz/website-vue/blob/main/src/components/Works.vue"></qiita-embed-ogp></p>

<p><details><summary>コード</summary><div>

<div class="code-frame" data-lang="vuejs"><div class="highlight"><pre><code><span class="nt">&lt;</span><span class="k">template</span><span class="nt">&gt;</span>
  <span class="nt">&lt;v-container&gt;</span>
  <span class="nt">&lt;h1&gt;</span>Works<span class="nt">&lt;/h1&gt;</span>
  <span class="nt">&lt;v-container</span> <span class="na">v-for=</span><span class="s">"app in apps"</span> <span class="na">v-bind:key=</span><span class="s">"app"</span><span class="nt">&gt;</span>
    <span class="nt">&lt;v-card&gt;</span>
      <span class="nt">&lt;v-card-title&gt;</span><span class="si">${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"}</span><span class="nx">app</span><span class="p">.</span><span class="nx">name</span><span class="si">${"$"}{"}"}${"$"}{"}"}</span><span class="nt">&lt;/v-card-title&gt;</span>
      <span class="nt">&lt;v-card-media&gt;</span>
        <span class="nt">&lt;v-img</span> <span class="na">:src=</span><span class="s">"app.img"</span><span class="nt">&gt;&lt;/v-img&gt;</span>
      <span class="nt">&lt;/v-card-media&gt;</span>
      <span class="nt">&lt;v-card-text&gt;</span><span class="si">${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"}</span> <span class="nx">app</span><span class="p">.</span><span class="nx">text</span> <span class="si">${"$"}{"}"}${"$"}{"}"}</span><span class="nt">&lt;/v-card-text&gt;</span>


      <span class="nt">&lt;v-card-subtitle&gt;</span>Platform <span class="si">${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"}</span> <span class="nx">app</span><span class="p">.</span><span class="nx">platform</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="dl">"</span><span class="s2">, </span><span class="dl">"</span><span class="p">)</span> <span class="si">${"$"}{"}"}${"$"}{"}"}</span><span class="nt">&lt;/v-card-subtitle&gt;</span>
      <span class="nt">&lt;v-card-subtitle&gt;</span>Status <span class="si">${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"}</span><span class="nx">app</span><span class="p">.</span><span class="nx">status</span><span class="si">${"$"}{"}"}${"$"}{"}"}</span><span class="nt">&lt;/v-card-subtitle&gt;</span>
      <span class="nt">&lt;v-card-text&gt;&lt;/v-card-text&gt;</span>
      <span class="nt">&lt;v-divider&gt;&lt;/v-divider&gt;</span>
      <span class="nt">&lt;v-card-actions&gt;</span>
        <span class="nt">&lt;v-btn</span> <span class="na">v-if=</span><span class="s">"app.url != ''"</span> <span class="na">:to=</span><span class="s">"app.url"</span><span class="nt">&gt;&lt;span</span> <span class="na">class=</span><span class="s">"text-info"</span><span class="nt">&gt;</span>Read more<span class="nt">&lt;/span&gt;&lt;/v-btn&gt;</span>
        <span class="nt">&lt;v-btn</span> <span class="na">v-if=</span><span class="s">"app.outerurl != ''"</span> <span class="na">:href=</span><span class="s">"app.outerurl"</span><span class="nt">&gt;&lt;span</span> <span class="na">class=</span><span class="s">"text-info"</span><span class="nt">&gt;</span>Read more<span class="nt">&lt;/span&gt;&lt;/v-btn&gt;</span>
      <span class="nt">&lt;/v-card-actions&gt;</span>
    <span class="nt">&lt;/v-card&gt;</span>
  <span class="nt">&lt;/v-container&gt;</span>
  <span class="nt">&lt;/v-container&gt;</span>
<span class="nt">&lt;/</span><span class="k">template</span><span class="nt">&gt;</span>

<span class="nt">&lt;</span><span class="k">script</span> <span class="na">setup</span><span class="nt">&gt;</span>
<span class="k">import</span> <span class="nx">routineTreeImg</span> <span class="k">from</span> <span class="dl">"</span><span class="s2">../assets/RoutineTree.png</span><span class="dl">"</span>
<span class="kd">const</span> <span class="nx">apps</span> <span class="o">=</span> <span class="p">[</span>
  <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="na">name</span><span class="p">:</span> <span class="dl">"</span><span class="s2">RoutineTree</span><span class="dl">"</span><span class="p">,</span>
    <span class="na">img</span><span class="p">:</span> <span class="nx">routineTreeImg</span><span class="p">,</span>
    <span class="na">text</span><span class="p">:</span> <span class="dl">"</span><span class="s2">Task management application that helps you accomplish your daily routine tasks.</span><span class="dl">"</span><span class="p">,</span>
    <span class="na">platform</span><span class="p">:</span> <span class="p">[</span><span class="dl">"</span><span class="s2">iOS</span><span class="dl">"</span><span class="p">],</span>
    <span class="na">status</span><span class="p">:</span> <span class="dl">"</span><span class="s2">In Review</span><span class="dl">"</span><span class="p">,</span>
    <span class="na">url</span><span class="p">:</span> <span class="dl">""</span><span class="p">,</span>
    <span class="na">outerurl</span><span class="p">:</span> <span class="dl">"</span><span class="s2">https://syamaz.github.io/RoutineTree/</span><span class="dl">"</span>
  <span class="p">${"$"}{"}"},</span>
  <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="na">name</span><span class="p">:</span> <span class="dl">"</span><span class="s2">My homepage</span><span class="dl">"</span><span class="p">,</span>
    <span class="na">img</span><span class="p">:</span> <span class="dl">""</span><span class="p">,</span>
    <span class="na">text</span><span class="p">:</span> <span class="dl">"</span><span class="s2">This website.</span><span class="dl">"</span><span class="p">,</span>
    <span class="na">platform</span><span class="p">:</span> <span class="p">[</span><span class="dl">"</span><span class="s2">web</span><span class="dl">"</span><span class="p">],</span>
    <span class="na">status</span><span class="p">:</span> <span class="dl">"</span><span class="s2">Released</span><span class="dl">"</span><span class="p">,</span>
    <span class="na">url</span><span class="p">:</span> <span class="dl">"</span><span class="s2">/</span><span class="dl">"</span><span class="p">,</span>
    <span class="na">outerurl</span><span class="p">:</span> <span class="dl">""</span>
  <span class="p">${"$"}{"}"}</span>
<span class="p">]</span>
<span class="nt">&lt;/</span><span class="k">script</span><span class="nt">&gt;</span>

<span class="nt">&lt;</span><span class="k">style</span><span class="nt">&gt;</span>
<span class="nt">&lt;/</span><span class="k">style</span><span class="nt">&gt;</span>
</code></pre></div></div>

<p></p>
</div></details></p>

<h5>
<span id="blazor" class="fragment"></span><a href="#blazor"><i class="fa fa-link"></i></a>Blazor</h5>

<p><qiita-embed-ogp src="https://github.com/sYamaz/website/blob/main/website/Pages/Works/WorksPage.razor"></qiita-embed-ogp></p>

<p><details><summary>コード</summary><div>

<div class="code-frame" data-lang="razor"><div class="highlight"><pre><code>@page "/works"

@inject NavigationManager navman
@using website.Components
@using website.Pages.Works.Parts
@using website.Pages.Works.Datas
&lt;style&gt;
    .styled-linkbutton ${"$"}{"{"${"$"}{"}"}
        @*縦並び*@
        display: block;
        text-transform:none;
    ${"$"}{"}"}

        .styled-linkbutton:is(:hover) ${"$"}{"{"${"$"}{"}"}
            text-decoration: underline;
        ${"$"}{"}"}
&lt;/style&gt;

&lt;PageTitle&gt;Works - sYamaz&lt;/PageTitle&gt;


&lt;Typography Variant="TypographyVariant.H5"&gt;
    Works
&lt;/Typography&gt;


@foreach (var item in Datas)
${"$"}{"{"${"$"}{"}"}
    &lt;Box Padding="2" Margin="2"&gt;
        &lt;WorkCardView WorkData="@item" /&gt;
    &lt;/Box&gt;
${"$"}{"}"}



@code ${"$"}{"{"${"$"}{"}"}



    private IEnumerable&lt;AnyWorkData&gt; Datas
    ${"$"}{"{"${"$"}{"}"}
        get
        ${"$"}{"{"${"$"}{"}"}


            yield return new AnyWorkData
            ${"$"}{"{"${"$"}{"}"}
                Title = "RoutineTree",
                Description = "Task management application that helps you accomplish your daily routine tasks.",
                ReadMoreURL = "https://syamaz.github.io/RoutineTree/",
                ImagePath = "images/RoutineTree.png",
                Status = WorkStatus.inReview,
                SupportPlatform = SupportPlatform.iOS
            ${"$"}{"}"};

            yield return new AnyWorkData
            ${"$"}{"{"${"$"}{"}"}
                Title = "Some web app/service",
                Description = "My practice project using Vue and AWS",
                ReadMoreURL = "",
                ImagePath = "images/Noimage.png",
                Status = WorkStatus.underDevelop,
                SupportPlatform = SupportPlatform.web
            ${"$"}{"}"};

            // --- end ---

            yield return new AnyWorkData
            ${"$"}{"{"${"$"}{"}"}
                Title = "My homepage",
                Description = "This website.",
                ReadMoreURL = "",
                ImagePath = "images/Noimage.png",
                Status = WorkStatus.release,
                SupportPlatform = SupportPlatform.web
            ${"$"}{"}"};
        ${"$"}{"}"}
    ${"$"}{"}"}


${"$"}{"}"}

</code></pre></div></div>

<p></p>
</div></details></p>

<h2>
<span id="ルーティング" class="fragment"></span><a href="#%E3%83%AB%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0"><i class="fa fa-link"></i></a>ルーティング</h2>

<p>Blazorの場合、デフォルトでルーティング機能が付いてます。</p>

<p><code>@page "/${"$"}{"{"${"$"}{"}"}url${"$"}{"}"}"</code>をコンポーネント内で宣言することで他ページから遷移することができます。</p>

<p>vueでvue-routerを使う場合はコンポーネントで宣言というよりは一括で宣言することになります。（ドキュメントを十分に読み込めてないだけで、別の方法があるかもしれません）</p>

<h5>
<span id="vue-1" class="fragment"></span><a href="#vue-1"><i class="fa fa-link"></i></a>vue</h5>

<p><qiita-embed-ogp src="https://github.com/sYamaz/website-vue/blob/main/src/router/index.js"></qiita-embed-ogp></p>

<p><details><summary>コード</summary><div>

<div class="code-frame" data-lang="js"><div class="highlight"><pre><code><span class="k">import</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="nx">createRouter</span><span class="p">,</span> <span class="nx">createWebHistory</span> <span class="p">${"$"}{"}"}</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">vue-router</span><span class="dl">'</span>
<span class="c1">// ページのコンポーネントをインポート</span>
<span class="k">import</span> <span class="nx">AboutVue</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">../components/About.vue</span><span class="dl">'</span>
<span class="k">import</span> <span class="nx">WorksVue</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">../components/Works.vue</span><span class="dl">'</span>
<span class="k">import</span> <span class="nx">PostsVue</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">../components/Posts.vue</span><span class="dl">'</span>


<span class="kd">const</span> <span class="nx">routes</span> <span class="o">=</span> <span class="p">[</span>
  <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="na">path</span><span class="p">:</span> <span class="dl">'</span><span class="s1">/</span><span class="dl">'</span><span class="p">,</span>
    <span class="na">name</span><span class="p">:</span> <span class="dl">'</span><span class="s1">About</span><span class="dl">'</span><span class="p">,</span>
    <span class="na">component</span><span class="p">:</span> <span class="nx">AboutVue</span>
  <span class="p">${"$"}{"}"},</span>
  <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="na">path</span><span class="p">:</span> <span class="dl">'</span><span class="s1">/works</span><span class="dl">'</span><span class="p">,</span>
    <span class="na">name</span><span class="p">:</span> <span class="dl">'</span><span class="s1">Works</span><span class="dl">'</span><span class="p">,</span>
    <span class="na">component</span><span class="p">:</span> <span class="nx">WorksVue</span>
  <span class="p">${"$"}{"}"},</span>
  <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="na">path</span><span class="p">:</span> <span class="dl">'</span><span class="s1">/posts</span><span class="dl">'</span><span class="p">,</span>
    <span class="na">name</span><span class="p">:</span> <span class="dl">'</span><span class="s1">Posts</span><span class="dl">'</span><span class="p">,</span>
    <span class="na">component</span><span class="p">:</span> <span class="nx">PostsVue</span>
  <span class="p">${"$"}{"}"},</span>
<span class="p">]</span>


<span class="kd">const</span> <span class="nx">baseURL</span> <span class="o">=</span> <span class="k">import</span><span class="p">.</span><span class="nx">meta</span><span class="p">.</span><span class="nx">env</span><span class="p">.</span><span class="nx">BASE_URL</span><span class="p">;</span>
<span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="dl">"</span><span class="s2">base : </span><span class="dl">"</span> <span class="o">+</span> <span class="nx">baseURL</span><span class="p">)</span>

<span class="kd">const</span> <span class="nx">router</span> <span class="o">=</span> <span class="nx">createRouter</span><span class="p">(${"$"}{"{"${"$"}{"}"}</span>
  <span class="na">history</span><span class="p">:</span> <span class="nx">createWebHistory</span><span class="p">(</span><span class="nx">baseURL</span><span class="p">),</span>
  <span class="nx">routes</span>
<span class="p">${"$"}{"}"})</span>

<span class="k">export</span> <span class="k">default</span> <span class="nx">router</span>
</code></pre></div></div>

<p></p>
</div></details></p>

<h2>
<span id="github-pages" class="fragment"></span><a href="#github-pages"><i class="fa fa-link"></i></a>GitHub Pages</h2>

<p>基本的に楽をしたいため、<code>gh-pages</code>npmパッケージを使用します。</p>

<p>vite.config.jsにデバッグ時と公開時でBaseURLをスイッチする定義を追加</p>

<div class="code-frame" data-lang="js"><div class="highlight"><pre><code><span class="c1">// vite.config.js</span>
<span class="k">import</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="nx">defineConfig</span> <span class="p">${"$"}{"}"}</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">vite</span><span class="dl">'</span>
<span class="k">import</span> <span class="nx">vue</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">@vitejs/plugin-vue</span><span class="dl">'</span>
<span class="k">import</span> <span class="nx">vuetify</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">@vuetify/vite-plugin</span><span class="dl">'</span>

<span class="k">import</span> <span class="nx">path</span> <span class="k">from</span> <span class="dl">'</span><span class="s1">path</span><span class="dl">'</span>

<span class="c1">// https://vitejs.dev/config/</span>
<span class="k">export</span> <span class="k">default</span> <span class="nx">defineConfig</span><span class="p">(${"$"}{"{"${"$"}{"}"}</span>
  <span class="c1">// 略</span>
  <span class="na">resolve</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="na">alias</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
      <span class="dl">'</span><span class="s1">@</span><span class="dl">'</span><span class="p">:</span> <span class="nx">path</span><span class="p">.</span><span class="nx">resolve</span><span class="p">(</span><span class="nx">__dirname</span><span class="p">,</span> <span class="dl">'</span><span class="s1">src</span><span class="dl">'</span><span class="p">),</span>
    <span class="p">${"$"}{"}"},</span>
  <span class="p">${"$"}{"}"},</span>
  <span class="c1">// この一行を追加　'/${"$"}{"{"${"$"}{"}"}Githubリポジトリ名${"$"}{"}"}'とか'/'とか</span>
  <span class="na">base</span><span class="p">:</span> <span class="nx">process</span><span class="p">.</span><span class="nx">env</span><span class="p">.</span><span class="nx">NODE_ENV</span> <span class="o">===</span> <span class="dl">'</span><span class="s1">production</span><span class="dl">'</span> <span class="p">?</span> <span class="dl">'</span><span class="s1">${"$"}{"{"${"$"}{"}"}公開時${"$"}{"}"}</span><span class="dl">'</span> <span class="p">:</span> <span class="dl">'</span><span class="s1">${"$"}{"{"${"$"}{"}"}デバッグ時${"$"}{"}"}</span><span class="dl">'</span><span class="p">,</span>

  <span class="c1">// 略</span>
<span class="p">${"$"}{"}"})</span>

</code></pre></div></div>

<p>このbaseプロパティをvue-routerで使用します</p>

<p><qiita-embed-ogp src="https://ja.vitejs.dev/guide/env-and-mode.html"></qiita-embed-ogp></p>

<blockquote>
<p>import.meta.env.BASE_URL: ${"$"}{"{"${"$"}{"}"}string${"$"}{"}"} アプリが配信されているベース URL。これは base 設定オプション によって決まります。</p>
</blockquote>

<p><qiita-embed-ogp src="https://github.com/sYamaz/website-vue/blob/main/src/router/index.js"></qiita-embed-ogp></p>

<div class="code-frame" data-lang="js"><div class="highlight"><pre><code><span class="c1">//vue-router@4</span>

<span class="kd">const</span> <span class="nx">baseURL</span> <span class="o">=</span> <span class="k">import</span><span class="p">.</span><span class="nx">meta</span><span class="p">.</span><span class="nx">env</span><span class="p">.</span><span class="nx">BASE_URL</span><span class="p">;</span>

<span class="kd">const</span> <span class="nx">router</span> <span class="o">=</span> <span class="nx">createRouter</span><span class="p">(${"$"}{"{"${"$"}{"}"}</span>
  <span class="na">history</span><span class="p">:</span> <span class="nx">createWebHistory</span><span class="p">(</span><span class="nx">baseURL</span><span class="p">),</span>
  <span class="nx">routes</span>
<span class="p">${"$"}{"}"})</span>

<span class="k">export</span> <span class="k">default</span> <span class="nx">router</span>
</code></pre></div></div>

<h1>
<span id="まとめ" class="fragment"></span><a href="#%E3%81%BE%E3%81%A8%E3%82%81"><i class="fa fa-link"></i></a>まとめ</h1>

<p>dotnet開発者が→Webに手を広げていく際の一つの道が、「WinForm/WPF/UWP」→「Blazor」→「vue」なのかもしれません</p>
`,body: `タイトルの通りのことをやってみました。

結論から言うと、Blazorをやっているとvueの学習コストが下がるので「dotnetしかやったことないよ！」という人にはVueはお勧めできるかと思います。

Blazorで作った話はこちら↓

* [BlazorでSkclusive-UIを使った話](https://qiita.com/sYamaz/items/d0b12043f5b25a36d8e6)
* ページ：https://syamaz.github.io/website/

今回作ったものはこちら↓

* ページ：https://syamaz.github.io/website-vue/

## 環境

* Vue3
* Vue-router@4
* Vuetify 3.0.0-alpha
* Vite
* gh-pages

## vueコンポーネントとrazorコンポーネント

コンポーネントにはスタイル、テンプレート（UI）、スクリプトが含まれるという点でvueコンポーネントとrazorコンポーネントはほぼ同じ役割を持たせることができます

以下、Materialデザインの「カード」を列挙するページについてのコンポーネントです。

##### vue

https://github.com/sYamaz/website-vue/blob/main/src/components/Works.vue

<details><summary>コード</summary><div>

\`\`\`vuejs
<template>
  <v-container>
  <h1>Works</h1>
  <v-container v-for="app in apps" v-bind:key="app">
    <v-card>
      <v-card-title>${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"}app.name${"$"}{"}"}${"$"}{"}"}</v-card-title>
      <v-card-media>
        <v-img :src="app.img"></v-img>
      </v-card-media>
      <v-card-text>${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"} app.text ${"$"}{"}"}${"$"}{"}"}</v-card-text>

      
      <v-card-subtitle>Platform ${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"} app.platform.join(", ") ${"$"}{"}"}${"$"}{"}"}</v-card-subtitle>
      <v-card-subtitle>Status ${"$"}{"{"${"$"}{"}"}${"$"}{"{"${"$"}{"}"}app.status${"$"}{"}"}${"$"}{"}"}</v-card-subtitle>
      <v-card-text></v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn v-if="app.url != ''" :to="app.url"><span class="text-info">Read more</span></v-btn>
        <v-btn v-if="app.outerurl != ''" :href="app.outerurl"><span class="text-info">Read more</span></v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  </v-container>
</template>

<script setup>
import routineTreeImg from "../assets/RoutineTree.png"
const apps = [
  ${"$"}{"{"${"$"}{"}"}
    name: "RoutineTree",
    img: routineTreeImg,
    text: "Task management application that helps you accomplish your daily routine tasks.",
    platform: ["iOS"],
    status: "In Review",
    url: "",
    outerurl: "https://syamaz.github.io/RoutineTree/"
  ${"$"}{"}"},
  ${"$"}{"{"${"$"}{"}"}
    name: "My homepage",
    img: "",
    text: "This website.",
    platform: ["web"],
    status: "Released",
    url: "/",
    outerurl: ""
  ${"$"}{"}"}
]
</script>

<style>
</style>
\`\`\`

</div></details>


##### Blazor

https://github.com/sYamaz/website/blob/main/website/Pages/Works/WorksPage.razor

<details><summary>コード</summary><div>

\`\`\`razor
@page "/works"

@inject NavigationManager navman
@using website.Components
@using website.Pages.Works.Parts
@using website.Pages.Works.Datas
<style>
    .styled-linkbutton ${"$"}{"{"${"$"}{"}"}
        @*縦並び*@
        display: block;
        text-transform:none;
    ${"$"}{"}"}

        .styled-linkbutton:is(:hover) ${"$"}{"{"${"$"}{"}"}
            text-decoration: underline;
        ${"$"}{"}"}
</style>

<PageTitle>Works - sYamaz</PageTitle>


<Typography Variant="TypographyVariant.H5">
    Works
</Typography>


@foreach (var item in Datas)
${"$"}{"{"${"$"}{"}"}
    <Box Padding="2" Margin="2">
        <WorkCardView WorkData="@item" />
    </Box>
${"$"}{"}"}



@code ${"$"}{"{"${"$"}{"}"}



    private IEnumerable<AnyWorkData> Datas
    ${"$"}{"{"${"$"}{"}"}
        get
        ${"$"}{"{"${"$"}{"}"}


            yield return new AnyWorkData
            ${"$"}{"{"${"$"}{"}"}
                Title = "RoutineTree",
                Description = "Task management application that helps you accomplish your daily routine tasks.",
                ReadMoreURL = "https://syamaz.github.io/RoutineTree/",
                ImagePath = "images/RoutineTree.png",
                Status = WorkStatus.inReview,
                SupportPlatform = SupportPlatform.iOS
            ${"$"}{"}"};

            yield return new AnyWorkData
            ${"$"}{"{"${"$"}{"}"}
                Title = "Some web app/service",
                Description = "My practice project using Vue and AWS",
                ReadMoreURL = "",
                ImagePath = "images/Noimage.png",
                Status = WorkStatus.underDevelop,
                SupportPlatform = SupportPlatform.web
            ${"$"}{"}"};

            // --- end ---

            yield return new AnyWorkData
            ${"$"}{"{"${"$"}{"}"}
                Title = "My homepage",
                Description = "This website.",
                ReadMoreURL = "",
                ImagePath = "images/Noimage.png",
                Status = WorkStatus.release,
                SupportPlatform = SupportPlatform.web
            ${"$"}{"}"};
        ${"$"}{"}"}
    ${"$"}{"}"}


${"$"}{"}"}

\`\`\`

</div></details>


## ルーティング

Blazorの場合、デフォルトでルーティング機能が付いてます。

\`@page "/${"$"}{"{"${"$"}{"}"}url${"$"}{"}"}"\`をコンポーネント内で宣言することで他ページから遷移することができます。

vueでvue-routerを使う場合はコンポーネントで宣言というよりは一括で宣言することになります。（ドキュメントを十分に読み込めてないだけで、別の方法があるかもしれません）

##### vue

https://github.com/sYamaz/website-vue/blob/main/src/router/index.js

<details><summary>コード</summary><div>

\`\`\`js
import ${"$"}{"{"${"$"}{"}"} createRouter, createWebHistory ${"$"}{"}"} from 'vue-router'
// ページのコンポーネントをインポート
import AboutVue from '../components/About.vue'
import WorksVue from '../components/Works.vue'
import PostsVue from '../components/Posts.vue'


const routes = [
  ${"$"}{"{"${"$"}{"}"}
    path: '/',
    name: 'About',
    component: AboutVue
  ${"$"}{"}"},
  ${"$"}{"{"${"$"}{"}"}
    path: '/works',
    name: 'Works',
    component: WorksVue
  ${"$"}{"}"},
  ${"$"}{"{"${"$"}{"}"}
    path: '/posts',
    name: 'Posts',
    component: PostsVue
  ${"$"}{"}"},
]


const baseURL = import.meta.env.BASE_URL;
console.log("base : " + baseURL)

const router = createRouter(${"$"}{"{"${"$"}{"}"}
  history: createWebHistory(baseURL),
  routes
${"$"}{"}"})

export default router
\`\`\`

</div></details>

## GitHub Pages

基本的に楽をしたいため、\`gh-pages\`npmパッケージを使用します。

vite.config.jsにデバッグ時と公開時でBaseURLをスイッチする定義を追加

\`\`\`js
// vite.config.js
import ${"$"}{"{"${"$"}{"}"} defineConfig ${"$"}{"}"} from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from '@vuetify/vite-plugin'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(${"$"}{"{"${"$"}{"}"}
  // 略
  resolve: ${"$"}{"{"${"$"}{"}"}
    alias: ${"$"}{"{"${"$"}{"}"}
      '@': path.resolve(__dirname, 'src'),
    ${"$"}{"}"},
  ${"$"}{"}"},
  // この一行を追加　'/${"$"}{"{"${"$"}{"}"}Githubリポジトリ名${"$"}{"}"}'とか'/'とか
  base: process.env.NODE_ENV === 'production' ? '${"$"}{"{"${"$"}{"}"}公開時${"$"}{"}"}' : '${"$"}{"{"${"$"}{"}"}デバッグ時${"$"}{"}"}',

  // 略
${"$"}{"}"})

\`\`\`

このbaseプロパティをvue-routerで使用します

https://ja.vitejs.dev/guide/env-and-mode.html

>import.meta.env.BASE_URL: ${"$"}{"{"${"$"}{"}"}string${"$"}{"}"} アプリが配信されているベース URL。これは base 設定オプション によって決まります。



https://github.com/sYamaz/website-vue/blob/main/src/router/index.js

\`\`\`js
//vue-router@4

const baseURL = import.meta.env.BASE_URL;

const router = createRouter(${"$"}{"{"${"$"}{"}"}
  history: createWebHistory(baseURL),
  routes
${"$"}{"}"})

export default router
\`\`\`

# まとめ

dotnet開発者が→Webに手を広げていく際の一つの道が、「WinForm/WPF/UWP」→「Blazor」→「vue」なのかもしれません
`,coediting: false,comments_count: 0,created_at: '2022-01-09T17:48:02+09:00',group: '{ }',id: '86f574ec54a1e23ea527',likes_count: 0,private: false,reactions_count: 0,tags: [{name: 'C#',versions: [  ]},{name: 'github-pages',versions: [  ]},{name: 'Vue.js',versions: [  ]},{name: 'Blazor',versions: [  ]}],title: 'C# Blazorで作ったサイトをVue.jsで作り直してみた',updated_at: '2022-01-09T17:48:02+09:00',url: 'https://qiita.com/sYamaz/items/86f574ec54a1e23ea527',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>本日で今年の仕事納めなので、2021/10/18から続けていた朝活について共有しようかと思います。<br>
（この記事も2021/12/29の朝活中に書いてます）</p>

<h2>
<span id="朝活のきっかけ" class="fragment"></span><a href="#%E6%9C%9D%E6%B4%BB%E3%81%AE%E3%81%8D%E3%81%A3%E3%81%8B%E3%81%91"><i class="fa fa-link"></i></a>朝活のきっかけ</h2>

<p>仕事で大きな区切りがあり、自分を見つめ直す機会がありました。<br>
今後企業で働くにしろ個人で働くにしろスキルは磨き続けなければいけない、というある意味当たり前のことを再認識したのがきっかけです。</p>

<h2>
<span id="朝活を始める前に最初にやったこと" class="fragment"></span><a href="#%E6%9C%9D%E6%B4%BB%E3%82%92%E5%A7%8B%E3%82%81%E3%82%8B%E5%89%8D%E3%81%AB%E6%9C%80%E5%88%9D%E3%81%AB%E3%82%84%E3%81%A3%E3%81%9F%E3%81%93%E3%81%A8"><i class="fa fa-link"></i></a>朝活を始める前に最初にやったこと</h2>

<p>M1 macbook air（一番安いモデル）を買いました。家に届いたのが10/17でその翌日から朝活を開始してます</p>

<h2>
<span id="朝活概要" class="fragment"></span><a href="#%E6%9C%9D%E6%B4%BB%E6%A6%82%E8%A6%81"><i class="fa fa-link"></i></a>朝活概要</h2>

<ul>
<li>出勤前の１時間程度</li>
<li>会社近くのドトールコーヒーでやる</li>
<li>平日は基本的に毎日、休日/休暇は任意</li>
<li>仕事が終わって帰宅後GitHubにpush</li>
</ul>

<h2>
<span id="結果" class="fragment"></span><a href="#%E7%B5%90%E6%9E%9C"><i class="fa fa-link"></i></a>結果</h2>

<p>2021/10/18から2021/12/29までで合計49時間（49日間）朝活をすることができました。</p>

<p>その間、以下３つの内容にチャレンジしてます。</p>

<h4>
<span id="iosアプリ" class="fragment"></span><a href="#ios%E3%82%A2%E3%83%97%E3%83%AA"><i class="fa fa-link"></i></a>iOSアプリ</h4>

<p><a href="https://camo.qiitausercontent.com/12bb9f005fe366ca5b442b6467d6931a0202d82e/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f35343634653663362d373066642d366537372d333561362d3737613261653265653362652e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F5464e6c6-70fd-6e77-35a6-77a2ae2ee3be.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=dd118a12ec06d93421db9ec270da5cca" alt="RoutineTree.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/5464e6c6-70fd-6e77-35a6-77a2ae2ee3be.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F5464e6c6-70fd-6e77-35a6-77a2ae2ee3be.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=de35680a82db997d9660ada033e7e978 1x" loading="lazy"></a></p>

<p>mac, iphoneユーザーなので、私の生活に役立つアプリを作ってストアに公開しようとトライしました。</p>

<p>過去もSwiftを趣味でいじってた期間はありましたが、真面目にストアに公開しようとしてたのは今回が初めてです。</p>

<p>現在は<code>In Review</code>中...</p>

<h4>
<span id="自身のホームページ" class="fragment"></span><a href="#%E8%87%AA%E8%BA%AB%E3%81%AE%E3%83%9B%E3%83%BC%E3%83%A0%E3%83%9A%E3%83%BC%E3%82%B8"><i class="fa fa-link"></i></a>自身のホームページ</h4>

<p><qiita-embed-ogp src="https://syamaz.github.io/website/"></qiita-embed-ogp></p>

<p>GitHub pagesにBlazorで作った私自身のウェブサイトをホスティングしてます。</p>

<p>GitHub pagesを使ってみたかったのと、dotnetのBlazorWebAssemblyを触ってみたかったためトライ。</p>

<h4>
<span id="webサービスvue-aws使用" class="fragment"></span><a href="#web%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9vue-aws%E4%BD%BF%E7%94%A8"><i class="fa fa-link"></i></a>Webサービス（Vue, AWS使用）</h4>

<p>現在挑戦中です。</p>

<p>iOS(モバイル)やって、ホームページ（静的Web）やったら次はWebアプリ/サービスかなということでやっています。</p>

<p>iOSアプリやBlazorホームページはdotnet開発という仕事での経験が何らかの形で活きていましたが、これはストレッチ目標感が強いです。</p>

<p>来年はしばらくこれをやってそうです。</p>

<h2>
<span id="今のところ朝活ってどうか" class="fragment"></span><a href="#%E4%BB%8A%E3%81%AE%E3%81%A8%E3%81%93%E3%82%8D%E6%9C%9D%E6%B4%BB%E3%81%A3%E3%81%A6%E3%81%A9%E3%81%86%E3%81%8B"><i class="fa fa-link"></i></a>今のところ朝活ってどうか</h2>

<p>語り尽くされている話かもしれませんが...</p>

<ul>
<li>早寝早起きが身につく。健康になりそう

<ul>
<li>22時半就寝、5時起床</li>
</ul>
</li>
<li>毎日コーヒー分（200~300円）のコストが発生

<ul>
<li>元を取るために集中することになる</li>
<li>自宅で継続できる自信があればそれでもいいかも（私は無かった）</li>
</ul>
</li>
<li>年末になった今「継続できた達成感」が得られている</li>
<li>時間を無駄にしないために目標に対して真っ直ぐな開発ができる気がする

<ul>
<li>ホームページ作成も<code>Blazor</code>, <code>GitHub pages</code>だけに集中して不要な機能拡張やデザインへのこだわりを排除できた気がする。</li>
</ul>
</li>
</ul>

<p>私個人としてはいいことの方が多かったので来年も続けます。</p>
`,body: `本日で今年の仕事納めなので、2021/10/18から続けていた朝活について共有しようかと思います。
（この記事も2021/12/29の朝活中に書いてます）

## 朝活のきっかけ

仕事で大きな区切りがあり、自分を見つめ直す機会がありました。
今後企業で働くにしろ個人で働くにしろスキルは磨き続けなければいけない、というある意味当たり前のことを再認識したのがきっかけです。

## 朝活を始める前に最初にやったこと

M1 macbook air（一番安いモデル）を買いました。家に届いたのが10/17でその翌日から朝活を開始してます

## 朝活概要

* 出勤前の１時間程度
* 会社近くのドトールコーヒーでやる
* 平日は基本的に毎日、休日/休暇は任意
* 仕事が終わって帰宅後GitHubにpush

## 結果

2021/10/18から2021/12/29までで合計49時間（49日間）朝活をすることができました。

その間、以下３つの内容にチャレンジしてます。

#### iOSアプリ

![RoutineTree.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/5464e6c6-70fd-6e77-35a6-77a2ae2ee3be.png)

mac, iphoneユーザーなので、私の生活に役立つアプリを作ってストアに公開しようとトライしました。

過去もSwiftを趣味でいじってた期間はありましたが、真面目にストアに公開しようとしてたのは今回が初めてです。

現在は\`In Review\`中...

#### 自身のホームページ

https://syamaz.github.io/website/

GitHub pagesにBlazorで作った私自身のウェブサイトをホスティングしてます。

GitHub pagesを使ってみたかったのと、dotnetのBlazorWebAssemblyを触ってみたかったためトライ。

#### Webサービス（Vue, AWS使用）

現在挑戦中です。

iOS(モバイル)やって、ホームページ（静的Web）やったら次はWebアプリ/サービスかなということでやっています。

iOSアプリやBlazorホームページはdotnet開発という仕事での経験が何らかの形で活きていましたが、これはストレッチ目標感が強いです。

来年はしばらくこれをやってそうです。

## 今のところ朝活ってどうか

語り尽くされている話かもしれませんが...

* 早寝早起きが身につく。健康になりそう
  * 22時半就寝、5時起床
* 毎日コーヒー分（200~300円）のコストが発生
  * 元を取るために集中することになる
  * 自宅で継続できる自信があればそれでもいいかも（私は無かった）
* 年末になった今「継続できた達成感」が得られている
* 時間を無駄にしないために目標に対して真っ直ぐな開発ができる気がする
  * ホームページ作成も\`Blazor\`, \`GitHub pages\`だけに集中して不要な機能拡張やデザインへのこだわりを排除できた気がする。

私個人としてはいいことの方が多かったので来年も続けます。
`,coediting: false,comments_count: 0,created_at: '2021-12-29T20:55:34+09:00',group: '{ }',id: '664b898221f7fef2b384',likes_count: 2,private: false,reactions_count: 0,tags: [{name: '朝活',versions: [  ]}],title: '朝活開発を約２カ月半行った結果',updated_at: '2021-12-29T20:55:34+09:00',url: 'https://qiita.com/sYamaz/items/664b898221f7fef2b384',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>GitHub Pagesで自分のポートフォリオサイト作りたいなと思い立ちましたが</p>

<ul>
<li>markdownで作るのはちょっと味気ない</li>
<li>html書くのめんどくさいし、ReactとかVueとかはまだ使ったことない</li>
<li>css書くのめんどくさい</li>
</ul>

<p>という壁がありました。ReactやVueなどのフレームワークは身につけたいところではありますが、とりあえずは手っ取り早く作りたかったのでBlazorとUIフレームワークの一つであるSkclusive-UIで作って見ました。</p>

<p>この記事はUIフレームワークについての記事になります。</p>

<h2>
<span id="環境" class="fragment"></span><a href="#%E7%92%B0%E5%A2%83"><i class="fa fa-link"></i></a>環境</h2>

<ul>
<li>VisualStudio for Mac 2022 preview</li>
<li>dotnet6</li>
</ul>

<h2>
<span id="skclusive-ui" class="fragment"></span><a href="#skclusive-ui"><i class="fa fa-link"></i></a>Skclusive-UI</h2>

<p>Github</p>

<ul>
<li><a href="https://github.com/skclusive/Skclusive.Material.Component" class="autolink" rel="nofollow noopener" target="_blank">https://github.com/skclusive/Skclusive.Material.Component</a></li>
<li><a href="https://github.com/skclusive/Skclusive.Material.Layout" class="autolink" rel="nofollow noopener" target="_blank">https://github.com/skclusive/Skclusive.Material.Layout</a></li>
</ul>

<p>パーツだけ使いたいのであればComponentの方だけ使えばOKです（Button, MenuなどパーツごとにNugetパッケージになっているので部分的に利用することもできます）</p>

<p>今回は全部任せるつもりで、ComponentとLayoutの両方を使用しています。両方Ver.5.2.0です。</p>

<p><a href="https://camo.qiitausercontent.com/ced58b643f2669f9f07e1bf0633743a60fdb9199/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f37663637383334612d303464342d646133632d366537612d3830323131323162343735612e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F7f67834a-04d4-da3c-6e7a-8021121b475a.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=a1ca69e2c6630f8546ae6438e9c49cee" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/7f67834a-04d4-da3c-6e7a-8021121b475a.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F7f67834a-04d4-da3c-6e7a-8021121b475a.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=28c9b1aed1a12734bed79302285946ae 1x" loading="lazy"></a></p>

<p>Docs</p>

<p><qiita-embed-ogp src="https://skclusive.github.io/Skclusive.Material.Docs/"></qiita-embed-ogp></p>

<p>このdocsの<a href="https://github.com/skclusive/Skclusive.Material.Docs" rel="nofollow noopener" target="_blank">ソース</a>を見ていれば大体できる気はします</p>

<h3>
<span id="_importrazor" class="fragment"></span><a href="#_importrazor"><i class="fa fa-link"></i></a>_import.razor</h3>

<p><a href="https://skclusive.github.io/Skclusive.Material.Docs/installation" rel="nofollow noopener" target="_blank">docsのinstallation with nuget</a>に書いてあることをすれば大丈夫ですが、<a href="https://skclusive.github.io/Skclusive.Material.Docs/release" rel="nofollow noopener" target="_blank">Migrating to 5.2.0 from 2.0.1</a>にあるように、<code>@using Skclusive.Material.Script</code>と<code>@using Skclusive.Material.Theme</code>を消しました。</p>

<p>それとは別で<code>@using Skclusive.Material.Link</code>を追加しています。<code>HyperLink</code>コンポーネント等を使うためです。</p>

<ul>
<li><a href="https://github.com/sYamaz/website/blob/main/website/_Imports.razor" class="autolink" rel="nofollow noopener" target="_blank">https://github.com/sYamaz/website/blob/main/website/_Imports.razor</a></li>
</ul>

<h3>
<span id="mainlayoutrazor" class="fragment"></span><a href="#mainlayoutrazor"><i class="fa fa-link"></i></a>MainLayout.razor</h3>

<p>VisualStudioで新規Blazorプロジェクトと共に作成される<code>MainLayout.razor</code>は削除しています。（Skclusive.Material.Layoutで定義済みであるため）</p>

<h3>
<span id="apprazor" class="fragment"></span><a href="#apprazor"><i class="fa fa-link"></i></a>App.razor</h3>

<p><code>RouterLayout</code>を<code>ThemeProvider</code>で囲います。<code>Light</code>,<code>Dark</code>プロパティは定義しなくてもOKです。定義しない場合はデフォルトのライトテーマ、ダークテーマが割当たります。</p>

<ul>
<li><a href="https://github.com/sYamaz/website/blob/main/website/App.razor" class="autolink" rel="nofollow noopener" target="_blank">https://github.com/sYamaz/website/blob/main/website/App.razor</a></li>
</ul>

<div class="code-frame" data-lang="html"><div class="highlight"><pre><code>
@using Skclusive.Material.Theme

<span class="nt">&lt;ThemeProvider</span>
               <span class="na">Light=</span><span class="s">"@Light"</span>
               <span class="na">Dark=</span><span class="s">"@Dark"</span><span class="nt">&gt;</span>
    <span class="nt">&lt;RouterLayout</span> <span class="na">Default=</span><span class="s">"@typeof(AppLayout)"</span><span class="nt">/&gt;</span>
<span class="nt">&lt;/ThemeProvider&gt;</span>

@code${"$"}{"{"${"$"}{"}"}
    public static ThemeValue Light = ThemeFactory.CreateTheme(new ThemeConfig
    ${"$"}{"{"${"$"}{"}"}
        Palette = new PaletteConfig
        ${"$"}{"{"${"$"}{"}"}
            Type = PaletteType.Light,

            Primary = new PaletteColorConfig
            ${"$"}{"{"${"$"}{"}"}
                Main = PaletteColors.Blue.X700
            ${"$"}{"}"},

            Secondary = new PaletteColorConfig
            ${"$"}{"{"${"$"}{"}"}
                Main = PaletteColors.Pink.A400.Darken(0.1m)
            ${"$"}{"}"},

            Background = new PaletteBackground
            ${"$"}{"{"${"$"}{"}"}
                Default = "#fff",

                Custom = new Dictionary<span class="nt">&lt;string</span><span class="err">,</span> <span class="na">string</span><span class="nt">&gt;</span>
                ${"$"}{"{"${"$"}{"}"}
                    ${"$"}{"{"${"$"}{"}"} "level1", "#fff" ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "level2", PaletteColors.Grey.X100 ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "appbar-color", "var(--theme-palette-primary-contrast-text)" ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "appbar-background-color", "var(--theme-palette-primary-main)" ${"$"}{"}"},
                ${"$"}{"}"},
            ${"$"}{"}"}
        ${"$"}{"}"}
    ${"$"}{"}"});

    public static ThemeValue Dark = ThemeFactory.CreateTheme(new ThemeConfig
    ${"$"}{"{"${"$"}{"}"}
        Palette = new PaletteConfig
        ${"$"}{"{"${"$"}{"}"}
            Type = PaletteType.Dark,

            Primary = new PaletteColorConfig
            ${"$"}{"{"${"$"}{"}"}
                Main = PaletteColors.Blue.X200
            ${"$"}{"}"},

            Secondary = new PaletteColorConfig
            ${"$"}{"{"${"$"}{"}"}
                Main = PaletteColors.Pink.X200
            ${"$"}{"}"},



            Background = new PaletteBackground
            ${"$"}{"{"${"$"}{"}"}
                Default = "#121212",

                Custom = new Dictionary<span class="nt">&lt;string</span><span class="err">,</span> <span class="na">string</span><span class="nt">&gt;</span>
                ${"$"}{"{"${"$"}{"}"}
                    ${"$"}{"{"${"$"}{"}"} "level1", PaletteColors.Grey.X900 ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "level2", "#333" ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "appbar-color", "#fff" ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "appbar-background-color", "#333" ${"$"}{"}"},
                ${"$"}{"}"},
            ${"$"}{"}"}
        ${"$"}{"}"}
    ${"$"}{"}"});
${"$"}{"}"}
</code></pre></div></div>

<h3>
<span id="applayoutrazor" class="fragment"></span><a href="#applayoutrazor"><i class="fa fa-link"></i></a>AppLayout.razor</h3>

<p>メインのレイアウト部分です。最初に削除したMainLayout相当です。</p>

<p>Skclusive.Material.LayoutではMainLayoutコンポーネントが定義済みになっており、良くも悪くも強制的にこのレイアウトを使うことになりそうです。</p>

<p>私の場合は楽であることを追求していたのでレイアウトが決まっているのは助かりました。<br>
一方で自由にレイアウトを決めたい人はSkclusive.Material.Componentのみを使用して好みのレイアウトにするということになりそうです。</p>

<ul>
<li><a href="https://github.com/sYamaz/website/blob/main/website/Shared/AppLayout.razor" class="autolink" rel="nofollow noopener" target="_blank">https://github.com/sYamaz/website/blob/main/website/Shared/AppLayout.razor</a></li>
</ul>

<div class="code-frame" data-lang="html"><div class="highlight"><pre><code>@inherits MaterialLayoutComponent
@inject NavigationManager navman
@using website.Components

<span class="nt">&lt;style&gt;</span>
    <span class="nc">.styled-menu-item</span><span class="nd">:not</span><span class="o">(</span><span class="nd">:active</span><span class="o">)</span><span class="nd">:is</span><span class="o">(</span><span class="nd">:hover</span><span class="o">)</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="c">/*カーソル当てた時の強調*/</span>
        <span class="nl">background-color</span><span class="p">:</span> <span class="n">var</span><span class="p">(</span><span class="n">--theme-palette-primary-main</span><span class="p">,</span> <span class="m">#90caf9</span><span class="p">);</span>
        <span class="nl">text-decoration</span><span class="p">:</span> <span class="nb">underline</span><span class="p">;</span>
        <span class="nl">color</span><span class="p">:</span> <span class="no">white</span><span class="p">;</span>
    <span class="p">${"$"}{"}"}</span>
    <span class="nc">.styled-menu-item</span><span class="nd">:active</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="c">/*現在表示しているページのMenuItemの色変更*/</span>
        <span class="nl">background-color</span><span class="p">:</span> <span class="n">var</span><span class="p">(</span><span class="n">--theme-palette-primary-main</span><span class="p">,</span> <span class="m">#fff</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>
    <span class="nc">.styled-nav-item</span><span class="nd">:is</span><span class="o">(</span><span class="nd">:hover</span><span class="o">)</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="nl">background-color</span><span class="p">:</span> <span class="n">var</span><span class="p">(</span><span class="n">--theme-palette-primary-main</span><span class="p">,</span> <span class="m">#90caf9</span><span class="p">);</span>
        <span class="nl">text-decoration</span><span class="p">:</span> <span class="nb">underline</span><span class="p">;</span>
    <span class="p">${"$"}{"}"}</span>
    <span class="nc">.styled-nav-item__active</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="nl">background-color</span><span class="p">:</span> <span class="n">var</span><span class="p">(</span><span class="n">--theme-palette-primary-main</span><span class="p">,</span> <span class="m">#fff</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>
<span class="nt">&lt;/style&gt;</span>

<span class="nt">&lt;MainLayout</span> <span class="na">TopbarClass=</span><span class="s">"App-Topbar"</span> <span class="nt">&gt;</span>

    <span class="nt">&lt;TitleContent&gt;</span>
        <span class="nt">&lt;Button</span> <span class="na">OnClick=</span><span class="s">"@(s =&gt; NavTo("</span><span class="err">"))"</span> <span class="na">Color=</span><span class="s">"Color.Inherit"</span> <span class="na">Style=</span><span class="s">"text-transform:none;"</span><span class="nt">&gt;</span>
            <span class="nt">&lt;Typography</span> <span class="na">NoWrap</span> <span class="na">Variant=</span><span class="s">"TypographyVariant.H6"</span><span class="nt">&gt;</span>
                sYamaz
            <span class="nt">&lt;/Typography&gt;</span>
        <span class="nt">&lt;/Button&gt;</span>
    <span class="nt">&lt;/TitleContent&gt;</span>


    <span class="nt">&lt;ActionsContent&gt;</span>
        <span class="nt">&lt;Hidden</span> <span class="na">ExtraSmallDown</span> <span class="na">Context=</span><span class="s">"HiddenContext"</span><span class="nt">&gt;</span>
            <span class="nt">&lt;div</span> <span class="na">class=</span><span class="s">"@HiddenContext.Class"</span><span class="nt">&gt;</span>
                @foreach (var navItem in navigationItems)
                ${"$"}{"{"${"$"}{"}"}
                    <span class="nt">&lt;Button</span> <span class="na">Style=</span><span class="s">"text-transform:none;"</span>
                            <span class="na">Color=</span><span class="s">"Color.Inherit"</span>
                            <span class="na">Class=</span><span class="s">"@("</span><span class="na">styled-nav-item</span><span class="err">"</span> <span class="err">+</span> <span class="na">ClassActive</span><span class="err">(</span><span class="na">navItem.Path</span><span class="err">))"</span>
                            <span class="na">OnClick=</span><span class="s">"@(s =&gt; NavTo(navItem.Path))"</span><span class="nt">&gt;</span>
                        <span class="nt">&lt;Typography</span> <span class="na">NoWrap</span> <span class="na">Variant=</span><span class="s">"TypographyVariant.Body1"</span><span class="nt">&gt;</span>@navItem.Title<span class="nt">&lt;/Typography&gt;</span>
                    <span class="nt">&lt;/Button&gt;</span>
                ${"$"}{"}"}

            <span class="nt">&lt;/div&gt;</span>
        <span class="nt">&lt;/Hidden&gt;</span>
        <span class="nt">&lt;ToggleTheme</span> <span class="nt">/&gt;</span>
    <span class="nt">&lt;/ActionsContent&gt;</span>

    <span class="nt">&lt;BodyContent&gt;</span>
        <span class="nt">&lt;Box</span> <span class="na">Padding=</span><span class="s">"3"</span> <span class="na">Class=</span><span class="s">"App-Body"</span><span class="nt">&gt;</span>
            @Body
        <span class="nt">&lt;/Box&gt;</span>
    <span class="nt">&lt;/BodyContent&gt;</span>
    <span class="nt">&lt;SidebarContent&gt;</span>
        <span class="nt">&lt;Navigation</span> <span class="na">Items=</span><span class="s">"@navigationItems"</span><span class="nt">/&gt;</span>
    <span class="nt">&lt;/SidebarContent&gt;</span>
<span class="nt">&lt;/MainLayout&gt;</span>

@code ${"$"}{"{"${"$"}{"}"}
    private void NavTo(string page)
    ${"$"}{"{"${"$"}{"}"}
        navman.NavigateTo(page);
        HandleClose(MenuCloseReason.BackdropClick);
    ${"$"}{"}"}

    private bool Open ${"$"}{"{"${"$"}{"}"} set; get; ${"$"}{"}"}

    private IReference ButtonRef ${"$"}{"{"${"$"}{"}"} set; get; ${"$"}{"}"} = new Reference();

    private List<span class="nt">&lt;NavigationItem&gt;</span> navigationItems = new List<span class="nt">&lt;NavigationItem&gt;</span>
    ${"$"}{"{"${"$"}{"}"}
        new NavigationItem${"$"}{"{"${"$"}{"}"}Path = "", Title = "About"${"$"}{"}"},
        new NavigationItem${"$"}{"{"${"$"}{"}"}Path = "apps", Title = "Apps"${"$"}{"}"},
        new NavigationItem${"$"}{"{"${"$"}{"}"}Path = "posts", Title = "Posts"${"$"}{"}"},
        new NavigationItem${"$"}{"{"${"$"}{"}"}Path = "https://github.com/sYamaz/website", Title = "Source", Icon=@<span class="nt">&lt;GitHubIcon</span> <span class="nt">/&gt;</span>${"$"}{"}"},
    ${"$"}{"}"};

    private void HandleClose(EventArgs args)
    ${"$"}{"{"${"$"}{"}"}

        Open = false;

        StateHasChanged();
    ${"$"}{"}"}

    private void HandleClose(MenuCloseReason reason)
    ${"$"}{"{"${"$"}{"}"}
        Open = false;

        StateHasChanged();
    ${"$"}{"}"}

    private void OnOpen()
    ${"$"}{"{"${"$"}{"}"}


        Open = true;

        StateHasChanged();
    ${"$"}{"}"}

    private string ClassActive(string page)
    ${"$"}{"{"${"$"}{"}"}
        System.Diagnostics.Debug.WriteLine(page);
        return navman.BaseUri + page == navman.Uri ? " styled-nav-item__active" : "";

    ${"$"}{"}"}
${"$"}{"}"}
</code></pre></div></div>

<h2>
<span id="できたもの" class="fragment"></span><a href="#%E3%81%A7%E3%81%8D%E3%81%9F%E3%82%82%E3%81%AE"><i class="fa fa-link"></i></a>できたもの</h2>

<p>ほぼSkclusiveのdocsのままですが、個人的に満足のいくサイトができました。</p>

<ul>
<li>GitHub pages: <a href="https://syamaz.github.io/website/" class="autolink" rel="nofollow noopener" target="_blank">https://syamaz.github.io/website/</a>
</li>
<li>GitHub: <a href="https://github.com/sYamaz/website" class="autolink" rel="nofollow noopener" target="_blank">https://github.com/sYamaz/website</a>
</li>
</ul>

<p><a href="https://camo.qiitausercontent.com/c50bcd1960efd5e969cc61e3d356f7efe53aa045/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f37636335306462332d656439322d346531342d316265322d3332306332363034376261652e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F7cc50db3-ed92-4e14-1be2-320c26047bae.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=58553c34d9c39751f8ee84efb1e10c9e" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/7cc50db3-ed92-4e14-1be2-320c26047bae.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F7cc50db3-ed92-4e14-1be2-320c26047bae.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=47506f5ed3074478ebf85ee19e48afa5 1x" loading="lazy"></a></p>

<hr>

<h2>
<span id="github-pagesについて参考にさせていただいた記事" class="fragment"></span><a href="#github-pages%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E5%8F%82%E8%80%83%E3%81%AB%E3%81%95%E3%81%9B%E3%81%A6%E3%81%84%E3%81%9F%E3%81%A0%E3%81%84%E3%81%9F%E8%A8%98%E4%BA%8B"><i class="fa fa-link"></i></a>GitHub pagesについて参考にさせていただいた記事</h2>

<p><qiita-embed-ogp src="https://qiita.com/nobu17/items/116a0d1c949885e21d70"></qiita-embed-ogp></p>
`,body: `GitHub Pagesで自分のポートフォリオサイト作りたいなと思い立ちましたが

* markdownで作るのはちょっと味気ない
* html書くのめんどくさいし、ReactとかVueとかはまだ使ったことない
* css書くのめんどくさい

という壁がありました。ReactやVueなどのフレームワークは身につけたいところではありますが、とりあえずは手っ取り早く作りたかったのでBlazorとUIフレームワークの一つであるSkclusive-UIで作って見ました。

この記事はUIフレームワークについての記事になります。

## 環境

* VisualStudio for Mac 2022 preview
* dotnet6

## Skclusive-UI

Github

* https://github.com/skclusive/Skclusive.Material.Component
* https://github.com/skclusive/Skclusive.Material.Layout

パーツだけ使いたいのであればComponentの方だけ使えばOKです（Button, MenuなどパーツごとにNugetパッケージになっているので部分的に利用することもできます）

今回は全部任せるつもりで、ComponentとLayoutの両方を使用しています。両方Ver.5.2.0です。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/7f67834a-04d4-da3c-6e7a-8021121b475a.png)

Docs

https://skclusive.github.io/Skclusive.Material.Docs/

このdocsの[ソース](https://github.com/skclusive/Skclusive.Material.Docs)を見ていれば大体できる気はします

### _import.razor

[docsのinstallation with nuget](https://skclusive.github.io/Skclusive.Material.Docs/installation)に書いてあることをすれば大丈夫ですが、[Migrating to 5.2.0 from 2.0.1](https://skclusive.github.io/Skclusive.Material.Docs/release)にあるように、\`@using Skclusive.Material.Script\`と\`@using Skclusive.Material.Theme\`を消しました。

それとは別で\`@using Skclusive.Material.Link\`を追加しています。\`HyperLink\`コンポーネント等を使うためです。

* https://github.com/sYamaz/website/blob/main/website/_Imports.razor

### MainLayout.razor

VisualStudioで新規Blazorプロジェクトと共に作成される\`MainLayout.razor\`は削除しています。（Skclusive.Material.Layoutで定義済みであるため）

### App.razor

\`RouterLayout\`を\`ThemeProvider\`で囲います。\`Light\`,\`Dark\`プロパティは定義しなくてもOKです。定義しない場合はデフォルトのライトテーマ、ダークテーマが割当たります。

* https://github.com/sYamaz/website/blob/main/website/App.razor

\`\`\`html

@using Skclusive.Material.Theme
 
<ThemeProvider
               Light="@Light"
               Dark="@Dark">
    <RouterLayout Default="@typeof(AppLayout)"/>
</ThemeProvider>

@code${"$"}{"{"${"$"}{"}"}
    public static ThemeValue Light = ThemeFactory.CreateTheme(new ThemeConfig
    ${"$"}{"{"${"$"}{"}"}
        Palette = new PaletteConfig
        ${"$"}{"{"${"$"}{"}"}
            Type = PaletteType.Light,

            Primary = new PaletteColorConfig
            ${"$"}{"{"${"$"}{"}"}
                Main = PaletteColors.Blue.X700
            ${"$"}{"}"},

            Secondary = new PaletteColorConfig
            ${"$"}{"{"${"$"}{"}"}
                Main = PaletteColors.Pink.A400.Darken(0.1m)
            ${"$"}{"}"},

            Background = new PaletteBackground
            ${"$"}{"{"${"$"}{"}"}
                Default = "#fff",

                Custom = new Dictionary<string, string>
                ${"$"}{"{"${"$"}{"}"}
                    ${"$"}{"{"${"$"}{"}"} "level1", "#fff" ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "level2", PaletteColors.Grey.X100 ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "appbar-color", "var(--theme-palette-primary-contrast-text)" ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "appbar-background-color", "var(--theme-palette-primary-main)" ${"$"}{"}"},
                ${"$"}{"}"},
            ${"$"}{"}"}
        ${"$"}{"}"}
    ${"$"}{"}"});

    public static ThemeValue Dark = ThemeFactory.CreateTheme(new ThemeConfig
    ${"$"}{"{"${"$"}{"}"}
        Palette = new PaletteConfig
        ${"$"}{"{"${"$"}{"}"}
            Type = PaletteType.Dark,

            Primary = new PaletteColorConfig
            ${"$"}{"{"${"$"}{"}"}
                Main = PaletteColors.Blue.X200
            ${"$"}{"}"},

            Secondary = new PaletteColorConfig
            ${"$"}{"{"${"$"}{"}"}
                Main = PaletteColors.Pink.X200
            ${"$"}{"}"},

           

            Background = new PaletteBackground
            ${"$"}{"{"${"$"}{"}"}
                Default = "#121212",

                Custom = new Dictionary<string, string>
                ${"$"}{"{"${"$"}{"}"}
                    ${"$"}{"{"${"$"}{"}"} "level1", PaletteColors.Grey.X900 ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "level2", "#333" ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "appbar-color", "#fff" ${"$"}{"}"},
                    ${"$"}{"{"${"$"}{"}"} "appbar-background-color", "#333" ${"$"}{"}"},
                ${"$"}{"}"},
            ${"$"}{"}"}
        ${"$"}{"}"}
    ${"$"}{"}"});
${"$"}{"}"}
\`\`\`

### AppLayout.razor

メインのレイアウト部分です。最初に削除したMainLayout相当です。

Skclusive.Material.LayoutではMainLayoutコンポーネントが定義済みになっており、良くも悪くも強制的にこのレイアウトを使うことになりそうです。

私の場合は楽であることを追求していたのでレイアウトが決まっているのは助かりました。
一方で自由にレイアウトを決めたい人はSkclusive.Material.Componentのみを使用して好みのレイアウトにするということになりそうです。

* https://github.com/sYamaz/website/blob/main/website/Shared/AppLayout.razor

\`\`\`html
@inherits MaterialLayoutComponent
@inject NavigationManager navman
@using website.Components

<style>
    .styled-menu-item:not(:active):is(:hover) ${"$"}{"{"${"$"}{"}"}
        /*カーソル当てた時の強調*/
        background-color: var(--theme-palette-primary-main, #90caf9);
        text-decoration: underline;
        color: white;
    ${"$"}{"}"}
    .styled-menu-item:active ${"$"}{"{"${"$"}{"}"}
        /*現在表示しているページのMenuItemの色変更*/
        background-color: var(--theme-palette-primary-main, #fff)
    ${"$"}{"}"}
    .styled-nav-item:is(:hover) ${"$"}{"{"${"$"}{"}"}
        background-color: var(--theme-palette-primary-main, #90caf9);
        text-decoration: underline;
    ${"$"}{"}"}
    .styled-nav-item__active ${"$"}{"{"${"$"}{"}"}
        background-color: var(--theme-palette-primary-main, #fff)
    ${"$"}{"}"}
</style>

<MainLayout TopbarClass="App-Topbar" >

    <TitleContent>
        <Button OnClick="@(s => NavTo(""))" Color="Color.Inherit" Style="text-transform:none;">
            <Typography NoWrap Variant="TypographyVariant.H6">
                sYamaz
            </Typography>
        </Button>
    </TitleContent>


    <ActionsContent>
        <Hidden ExtraSmallDown Context="HiddenContext">
            <div class="@HiddenContext.Class">
                @foreach (var navItem in navigationItems)
                ${"$"}{"{"${"$"}{"}"}
                    <Button Style="text-transform:none;"
                            Color="Color.Inherit"
                            Class="@("styled-nav-item" + ClassActive(navItem.Path))"
                            OnClick="@(s => NavTo(navItem.Path))">
                        <Typography NoWrap Variant="TypographyVariant.Body1">@navItem.Title</Typography>
                    </Button>
                ${"$"}{"}"}
              
            </div>
        </Hidden>
        <ToggleTheme />
    </ActionsContent>

    <BodyContent>
        <Box Padding="3" Class="App-Body">
            @Body
        </Box>
    </BodyContent>
    <SidebarContent>
        <Navigation Items="@navigationItems"/>
    </SidebarContent>
</MainLayout>

@code ${"$"}{"{"${"$"}{"}"}
    private void NavTo(string page)
    ${"$"}{"{"${"$"}{"}"}
        navman.NavigateTo(page);
        HandleClose(MenuCloseReason.BackdropClick);
    ${"$"}{"}"}

    private bool Open ${"$"}{"{"${"$"}{"}"} set; get; ${"$"}{"}"}

    private IReference ButtonRef ${"$"}{"{"${"$"}{"}"} set; get; ${"$"}{"}"} = new Reference();

    private List<NavigationItem> navigationItems = new List<NavigationItem>
    ${"$"}{"{"${"$"}{"}"}
        new NavigationItem${"$"}{"{"${"$"}{"}"}Path = "", Title = "About"${"$"}{"}"},
        new NavigationItem${"$"}{"{"${"$"}{"}"}Path = "apps", Title = "Apps"${"$"}{"}"},
        new NavigationItem${"$"}{"{"${"$"}{"}"}Path = "posts", Title = "Posts"${"$"}{"}"},
        new NavigationItem${"$"}{"{"${"$"}{"}"}Path = "https://github.com/sYamaz/website", Title = "Source", Icon=@<GitHubIcon />${"$"}{"}"},
    ${"$"}{"}"};

    private void HandleClose(EventArgs args)
    ${"$"}{"{"${"$"}{"}"}

        Open = false;

        StateHasChanged();
    ${"$"}{"}"}

    private void HandleClose(MenuCloseReason reason)
    ${"$"}{"{"${"$"}{"}"}
        Open = false;

        StateHasChanged();
    ${"$"}{"}"}

    private void OnOpen()
    ${"$"}{"{"${"$"}{"}"}


        Open = true;

        StateHasChanged();
    ${"$"}{"}"}

    private string ClassActive(string page)
    ${"$"}{"{"${"$"}{"}"}
        System.Diagnostics.Debug.WriteLine(page);
        return navman.BaseUri + page == navman.Uri ? " styled-nav-item__active" : "";

    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

## できたもの

ほぼSkclusiveのdocsのままですが、個人的に満足のいくサイトができました。

* GitHub pages: https://syamaz.github.io/website/
* GitHub: https://github.com/sYamaz/website

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/7cc50db3-ed92-4e14-1be2-320c26047bae.png)


---

## GitHub pagesについて参考にさせていただいた記事

https://qiita.com/nobu17/items/116a0d1c949885e21d70
`,coediting: false,comments_count: 0,created_at: '2021-12-25T20:01:57+09:00',group: '{ }',id: 'd0b12043f5b25a36d8e6',likes_count: 2,private: false,reactions_count: 0,tags: [{name: 'github-pages',versions: [  ]},{name: 'dotnet',versions: [  ]},{name: 'Blazor',versions: [  ]},{name: 'BlazorWebAssembly',versions: [  ]},{name: 'Skclusive-UI',versions: [  ]}],title: 'BlazorでSkclusive-UIを使った話',updated_at: '2021-12-25T20:01:57+09:00',url: 'https://qiita.com/sYamaz/items/d0b12043f5b25a36d8e6',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>Human Interface Guidelinesに沿った使い回しが効くようなTextFieldを検討しました</p>

<ul>
<li>Swift5</li>
<li>Xcode ver.13.1</li>
</ul>

<h1>
<span id="textfield" class="fragment"></span><a href="#textfield"><i class="fa fa-link"></i></a>TextField</h1>

<p><a href="https://developer.apple.com/design/human-interface-guidelines/ios/controls/text-fields/" rel="nofollow noopener" target="_blank">Human Interface Guidelines - TextFields</a></p>

<p>2021.12.7時点で書いてあることは以下</p>

<ol>
<li>１行である</li>
<li>固定高さである</li>
<li>タップすると自動でキーボードが表示される</li>
<li>名前やメールアドレスなどの少量の情報を要求するときに使用する</li>
<li>別のラベルではなくプレースホルダーを表示する（プレースホルダーで十分説明可能な時）</li>
<li>テキストのクリアボタンを末尾につける</li>
<li>パスワードの入力などには情報を隠すためセキュアなテキストフィールド（SecureField）を使用する</li>
<li>フィールドの両端にはフィールドの目的を示すイメージや追加機能のボタンを追加できる</li>
</ol>

<p>SwiftUIのTextFieldを使う際には<code>6.テキストのクリアボタンを末尾につける</code>、<code>8.フィールドの先頭にはフィールドの目的を示すイメージ、末尾には追加機能のボタンを追加できる</code>は自前実装する必要があります。</p>

<h2>
<span id="テキストのクリアボタンを末尾につける" class="fragment"></span><a href="#%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%81%AE%E3%82%AF%E3%83%AA%E3%82%A2%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E6%9C%AB%E5%B0%BE%E3%81%AB%E3%81%A4%E3%81%91%E3%82%8B"><i class="fa fa-link"></i></a>テキストのクリアボタンを末尾につける</h2>

<p>編集中のみ×ボタンが表示されるやつです。</p>

<p><a href="https://camo.qiitausercontent.com/1abef334696efca9b6fd63f7908054912edd3d87/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f35353435326164392d336361352d626238312d666332352d3838313337363331613235612e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F55452ad9-3ca5-bb81-fc25-88137631a25a.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=b5630b6e8cf04e73abf276af16c4d87a" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/55452ad9-3ca5-bb81-fc25-88137631a25a.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F55452ad9-3ca5-bb81-fc25-88137631a25a.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=d60173cc07143e0a7ec294519df16530 1x" loading="lazy"></a></p>

<p>※ ↑の画像はList内に配置しているものです</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">SwiftUI</span>

<span class="kd">struct</span> <span class="kt">HIGTextField</span><span class="o">&lt;</span><span class="kt">Leading</span><span class="p">:</span><span class="kt">View</span><span class="p">,</span> <span class="kt">Trailing</span><span class="p">:</span><span class="kt">View</span><span class="o">&gt;</span><span class="p">:</span> <span class="kt">View</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">@Binding</span> <span class="kd">public</span> <span class="k">var</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span>
    <span class="k">let</span> <span class="nv">prompt</span><span class="p">:</span><span class="kt">String</span>

    <span class="kd">@State</span> <span class="kd">private</span> <span class="k">var</span> <span class="nv">editing</span><span class="p">:</span><span class="kt">Bool</span> <span class="o">=</span> <span class="kc">false</span>

    <span class="k">var</span> <span class="nv">body</span><span class="p">:</span> <span class="kd">some</span> <span class="kt">View</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="kt">HStack</span><span class="p">(</span><span class="nv">alignment</span><span class="p">:</span> <span class="o">.</span><span class="n">center</span><span class="p">,</span> <span class="nv">spacing</span><span class="p">:</span> <span class="kc">nil</span><span class="p">,</span> <span class="nv">content</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
            <span class="c1">// for future iOS</span>
            <span class="c1">// TextField("title", text: ${"$"}task.title, prompt:Text("Routine name"))</span>
            <span class="c1">//                            .focused(${"$"}titleFocused)</span>
            <span class="c1">//</span>
            <span class="kt">TextField</span><span class="p">(</span><span class="n">prompt</span><span class="p">,</span> <span class="nv">text</span><span class="p">:</span> <span class="err">${"$"}</span><span class="n">text</span><span class="p">,</span> <span class="nv">onEditingChanged</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span><span class="n">editing</span> <span class="k">in</span>
                    <span class="k">self</span><span class="o">.</span><span class="n">editing</span> <span class="o">=</span> <span class="n">editing</span>
            <span class="p">${"$"}{"}"},</span> <span class="nv">onCommit</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}${"$"}{"}"})</span>
            <span class="k">if</span><span class="p">(</span><span class="n">editing</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                <span class="kt">Button</span><span class="p">(</span><span class="nv">action</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">text</span> <span class="o">=</span> <span class="s">""</span>
                <span class="p">${"$"}{"}"},</span> <span class="nv">label</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="kt">Image</span><span class="p">(</span><span class="nv">systemName</span><span class="p">:</span> <span class="s">"xmark.circle.fill"</span><span class="p">)</span>
                        <span class="o">.</span><span class="nf">foregroundColor</span><span class="p">(</span><span class="o">.</span><span class="n">secondary</span><span class="p">)</span>
                <span class="p">${"$"}{"}"})</span>
            <span class="p">${"$"}{"}"}</span>
        <span class="p">${"$"}{"}"})</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<p>※onEditingChanged, onCommitを引数とするTextFieldのイニシャライザは将来的に非推奨となるため、後々はfocused()モディファイアを使った方法に変えた方が良さそうです。</p>

<h2>
<span id="フィールド先頭にはフィールドの目的を示すイメージ末尾には追加機能のボタンを追加できる" class="fragment"></span><a href="#%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%89%E5%85%88%E9%A0%AD%E3%81%AB%E3%81%AF%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%89%E3%81%AE%E7%9B%AE%E7%9A%84%E3%82%92%E7%A4%BA%E3%81%99%E3%82%A4%E3%83%A1%E3%83%BC%E3%82%B8%E6%9C%AB%E5%B0%BE%E3%81%AB%E3%81%AF%E8%BF%BD%E5%8A%A0%E6%A9%9F%E8%83%BD%E3%81%AE%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%A7%E3%81%8D%E3%82%8B"><i class="fa fa-link"></i></a>フィールド先頭にはフィールドの目的を示すイメージ、末尾には追加機能のボタンを追加できる</h2>

<p>さらに、検索バーの虫眼鏡アイコンや、音声入力ボタンなどを実現できるようにします</p>

<p>編集してない時</p>

<p><a href="https://camo.qiitausercontent.com/46e1fe5e32299d06abba47ff5087cabfe04df4fe/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f65616335636539332d626533362d656336632d626535332d3761336463393931373264632e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2Feac5ce93-be36-ec6c-be53-7a3dc99172dc.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=08a55fbc8bd23ffc7859a09e9cd086dc" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/eac5ce93-be36-ec6c-be53-7a3dc99172dc.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2Feac5ce93-be36-ec6c-be53-7a3dc99172dc.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=61408e22aff7a55ff0c27a214af481aa 1x" loading="lazy"></a></p>

<p>編集している時</p>

<p><a href="https://camo.qiitausercontent.com/0cd4be4553a52b45737407cf324c505cc55bc950/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f64386538376534362d616631662d323964342d613334302d3761393736646532616263662e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2Fd8e87e46-af1f-29d4-a340-7a976de2abcf.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=937ad11b9ef67730ee89076305b32b7d" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/d8e87e46-af1f-29d4-a340-7a976de2abcf.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2Fd8e87e46-af1f-29d4-a340-7a976de2abcf.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=c871c132cc684f211475c38bd33e5329 1x" loading="lazy"></a></p>

<p>※ ×ボタンは維持しつつ、両端のImageやButtonを必要に応じてイニシャライザで定義できるようにします<br>
※ ↑の画像はVStack内に配置し、<code>.background(RoundedRectangle(cornerRadius: 8).fill(.regularMaterial))</code>としたものです</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">SwiftUI</span>

<span class="kd">struct</span> <span class="kt">HIGTextField</span><span class="o">&lt;</span><span class="kt">Leading</span><span class="p">:</span><span class="kt">View</span><span class="p">,</span> <span class="kt">Trailing</span><span class="p">:</span><span class="kt">View</span><span class="o">&gt;</span><span class="p">:</span> <span class="kt">View</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">typealias</span> <span class="kt">Focused</span> <span class="o">=</span> <span class="kt">Bool</span>
    <span class="kd">@Binding</span> <span class="kd">public</span> <span class="k">var</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span>
    <span class="k">let</span> <span class="nv">prompt</span><span class="p">:</span><span class="kt">String</span>
    <span class="c1">// 第１引数は編集中のテキスト、第２引数は現在TextFieldが編集状態かどうか。</span>
    <span class="c1">// 第１引数によって両端に追加するボタンから編集中のテキストにアクセスできるようにし</span>
    <span class="c1">// 第２引数によって編集中かどうかによってコントロールの表示を切り替えられるようにする</span>
    <span class="k">let</span> <span class="nv">leading</span><span class="p">:(</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span> <span class="kt">Focused</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">Leading</span>
    <span class="k">let</span> <span class="nv">trailing</span><span class="p">:(</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span> <span class="kt">Focused</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">Trailing</span>

    <span class="kd">@State</span> <span class="kd">private</span> <span class="k">var</span> <span class="nv">editing</span><span class="p">:</span><span class="kt">Bool</span> <span class="o">=</span> <span class="kc">false</span>
    <span class="c1">// 両端にUIを追加するパターン</span>
    <span class="nf">init</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span>
         <span class="nv">prompt</span><span class="p">:</span><span class="kt">String</span><span class="p">,</span>
         <span class="nv">leading</span><span class="p">:</span> <span class="kd">@escaping</span> <span class="p">(</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span> <span class="kt">Focused</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">Leading</span><span class="p">,</span>
         <span class="nv">trailing</span><span class="p">:</span> <span class="kd">@escaping</span> <span class="p">(</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span> <span class="kt">Focused</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">Trailing</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">self</span><span class="o">.</span><span class="n">_text</span> <span class="o">=</span> <span class="n">text</span>
        <span class="k">self</span><span class="o">.</span><span class="n">prompt</span> <span class="o">=</span> <span class="n">prompt</span>
        <span class="k">self</span><span class="o">.</span><span class="n">leading</span> <span class="o">=</span> <span class="n">leading</span>
        <span class="k">self</span><span class="o">.</span><span class="n">trailing</span> <span class="o">=</span> <span class="n">trailing</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="k">var</span> <span class="nv">body</span><span class="p">:</span> <span class="kd">some</span> <span class="kt">View</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="kt">HStack</span><span class="p">(</span><span class="nv">alignment</span><span class="p">:</span> <span class="o">.</span><span class="n">center</span><span class="p">,</span> <span class="nv">spacing</span><span class="p">:</span> <span class="kc">nil</span><span class="p">,</span> <span class="nv">content</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
            <span class="nf">leading</span><span class="p">(</span><span class="err">${"$"}</span><span class="n">text</span><span class="p">,</span> <span class="k">self</span><span class="o">.</span><span class="n">editing</span><span class="p">)</span>
            <span class="c1">// for future iOS</span>
            <span class="c1">// TextField("title", text: ${"$"}task.title, prompt:Text("Routine name"))</span>
            <span class="c1">//                            .focused(${"$"}titleFocused)</span>
            <span class="c1">//</span>
            <span class="kt">TextField</span><span class="p">(</span><span class="n">prompt</span><span class="p">,</span> <span class="nv">text</span><span class="p">:</span> <span class="err">${"$"}</span><span class="n">text</span><span class="p">,</span> <span class="nv">onEditingChanged</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span><span class="n">editing</span> <span class="k">in</span>

                    <span class="k">self</span><span class="o">.</span><span class="n">editing</span> <span class="o">=</span> <span class="n">editing</span>

            <span class="p">${"$"}{"}"},</span> <span class="nv">onCommit</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}${"$"}{"}"})</span>

            <span class="nf">trailing</span><span class="p">(</span><span class="err">${"$"}</span><span class="n">text</span><span class="p">,</span> <span class="k">self</span><span class="o">.</span><span class="n">editing</span><span class="p">)</span>

            <span class="k">if</span><span class="p">(</span><span class="n">editing</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                <span class="kt">Button</span><span class="p">(</span><span class="nv">action</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">text</span> <span class="o">=</span> <span class="s">""</span>
                <span class="p">${"$"}{"}"},</span> <span class="nv">label</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="kt">Image</span><span class="p">(</span><span class="nv">systemName</span><span class="p">:</span> <span class="s">"xmark.circle.fill"</span><span class="p">)</span>
                        <span class="o">.</span><span class="nf">foregroundColor</span><span class="p">(</span><span class="o">.</span><span class="n">secondary</span><span class="p">)</span>
                <span class="p">${"$"}{"}"})</span>
            <span class="p">${"$"}{"}"}</span>
        <span class="p">${"$"}{"}"})</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">extension</span> <span class="kt">HIGTextField</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="c1">// 前後に何の機能もないパターン</span>
    <span class="nf">init</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span> <span class="nv">prompt</span><span class="p">:</span><span class="kt">String</span><span class="p">)</span> <span class="k">where</span> <span class="kt">Leading</span> <span class="o">==</span> <span class="kt">EmptyView</span><span class="p">,</span> <span class="kt">Trailing</span> <span class="o">==</span> <span class="kt">EmptyView</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">self</span><span class="o">.</span><span class="nf">init</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span> <span class="n">text</span><span class="p">,</span> <span class="nv">prompt</span><span class="p">:</span> <span class="n">prompt</span><span class="p">,</span> <span class="nv">leading</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}(</span><span class="n">b</span><span class="p">,</span> <span class="n">f</span><span class="p">)</span> <span class="k">in</span> <span class="kt">EmptyView</span><span class="p">()${"$"}{"}"},</span> <span class="nv">trailing</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}(</span><span class="n">b</span><span class="p">,</span> <span class="n">f</span><span class="p">)</span> <span class="k">in</span> <span class="kt">EmptyView</span><span class="p">()${"$"}{"}"})</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="c1">// 先頭にUIを追加するパターン</span>
    <span class="nf">init</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span> <span class="nv">prompt</span><span class="p">:</span><span class="kt">String</span><span class="p">,</span> <span class="nv">leading</span><span class="p">:</span><span class="kd">@escaping</span> <span class="p">(</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span> <span class="kt">Focused</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">Leading</span><span class="p">)</span> <span class="k">where</span> <span class="kt">Trailing</span> <span class="o">==</span> <span class="kt">EmptyView</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">self</span><span class="o">.</span><span class="nf">init</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span> <span class="n">text</span><span class="p">,</span> <span class="nv">prompt</span><span class="p">:</span> <span class="n">prompt</span><span class="p">,</span> <span class="nv">leading</span><span class="p">:</span> <span class="n">leading</span><span class="p">,</span> <span class="nv">trailing</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}(</span><span class="n">b</span><span class="p">,</span> <span class="n">f</span><span class="p">)</span> <span class="k">in</span> <span class="kt">EmptyView</span><span class="p">()${"$"}{"}"})</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="c1">// 末尾にUIを追加するパターン</span>
    <span class="nf">init</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span> <span class="nv">prompt</span><span class="p">:</span><span class="kt">String</span><span class="p">,</span> <span class="nv">trailing</span><span class="p">:</span><span class="kd">@escaping</span> <span class="p">(</span><span class="kt">Binding</span><span class="o">&lt;</span><span class="kt">String</span><span class="o">&gt;</span><span class="p">,</span> <span class="kt">Focused</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">Trailing</span><span class="p">)</span> <span class="k">where</span> <span class="kt">Leading</span> <span class="o">==</span> <span class="kt">EmptyView</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">self</span><span class="o">.</span><span class="nf">init</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span> <span class="n">text</span><span class="p">,</span> <span class="nv">prompt</span><span class="p">:</span> <span class="n">prompt</span><span class="p">,</span> <span class="nv">leading</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}(</span><span class="n">b</span><span class="p">,</span> <span class="n">f</span><span class="p">)</span> <span class="k">in</span> <span class="kt">EmptyView</span><span class="p">()${"$"}{"}"},</span> <span class="nv">trailing</span><span class="p">:</span> <span class="n">trailing</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<h2>
<span id="結果" class="fragment"></span><a href="#%E7%B5%90%E6%9E%9C"><i class="fa fa-link"></i></a>結果</h2>

<p>おおよそのパターンに対応できそうな汎用的なTextFieldができました。</p>
`,body: `Human Interface Guidelinesに沿った使い回しが効くようなTextFieldを検討しました

- Swift5
- Xcode ver.13.1

# TextField

[Human Interface Guidelines - TextFields](https://developer.apple.com/design/human-interface-guidelines/ios/controls/text-fields/)

2021.12.7時点で書いてあることは以下

1. １行である
1. 固定高さである
1. タップすると自動でキーボードが表示される
1. 名前やメールアドレスなどの少量の情報を要求するときに使用する
1. 別のラベルではなくプレースホルダーを表示する（プレースホルダーで十分説明可能な時）
1. テキストのクリアボタンを末尾につける
1. パスワードの入力などには情報を隠すためセキュアなテキストフィールド（SecureField）を使用する
1. フィールドの両端にはフィールドの目的を示すイメージや追加機能のボタンを追加できる

SwiftUIのTextFieldを使う際には\`6.テキストのクリアボタンを末尾につける\`、\`8.フィールドの先頭にはフィールドの目的を示すイメージ、末尾には追加機能のボタンを追加できる\`は自前実装する必要があります。

## テキストのクリアボタンを末尾につける

編集中のみ×ボタンが表示されるやつです。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/55452ad9-3ca5-bb81-fc25-88137631a25a.png)

※ ↑の画像はList内に配置しているものです

\`\`\`swift
import SwiftUI

struct HIGTextField<Leading:View, Trailing:View>: View ${"$"}{"{"${"$"}{"}"}
    @Binding public var text:String
    let prompt:String

    @State private var editing:Bool = false

    var body: some View ${"$"}{"{"${"$"}{"}"}
        HStack(alignment: .center, spacing: nil, content: ${"$"}{"{"${"$"}{"}"}
            // for future iOS
            // TextField("title", text: ${"$"}task.title, prompt:Text("Routine name"))
            //                            .focused(${"$"}titleFocused)
            //
            TextField(prompt, text: ${"$"}text, onEditingChanged: ${"$"}{"{"${"$"}{"}"}editing in
                    self.editing = editing
            ${"$"}{"}"}, onCommit: ${"$"}{"{"${"$"}{"}"}${"$"}{"}"})
            if(editing)${"$"}{"{"${"$"}{"}"}
                Button(action: ${"$"}{"{"${"$"}{"}"}
                    text = ""
                ${"$"}{"}"}, label: ${"$"}{"{"${"$"}{"}"}
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.secondary)
                ${"$"}{"}"})
            ${"$"}{"}"}
        ${"$"}{"}"})
    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

※onEditingChanged, onCommitを引数とするTextFieldのイニシャライザは将来的に非推奨となるため、後々はfocused()モディファイアを使った方法に変えた方が良さそうです。

## フィールド先頭にはフィールドの目的を示すイメージ、末尾には追加機能のボタンを追加できる

さらに、検索バーの虫眼鏡アイコンや、音声入力ボタンなどを実現できるようにします

編集してない時

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/eac5ce93-be36-ec6c-be53-7a3dc99172dc.png)

編集している時

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/d8e87e46-af1f-29d4-a340-7a976de2abcf.png)

※ ×ボタンは維持しつつ、両端のImageやButtonを必要に応じてイニシャライザで定義できるようにします
※ ↑の画像はVStack内に配置し、\`.background(RoundedRectangle(cornerRadius: 8).fill(.regularMaterial))\`としたものです

\`\`\`swift
import SwiftUI

struct HIGTextField<Leading:View, Trailing:View>: View ${"$"}{"{"${"$"}{"}"}
    typealias Focused = Bool
    @Binding public var text:String
    let prompt:String
    // 第１引数は編集中のテキスト、第２引数は現在TextFieldが編集状態かどうか。
    // 第１引数によって両端に追加するボタンから編集中のテキストにアクセスできるようにし
    // 第２引数によって編集中かどうかによってコントロールの表示を切り替えられるようにする
    let leading:(Binding<String>, Focused) -> Leading
    let trailing:(Binding<String>, Focused) -> Trailing
    
    @State private var editing:Bool = false
    // 両端にUIを追加するパターン
    init(text:Binding<String>,
         prompt:String,
         leading: @escaping (Binding<String>, Focused) -> Leading,
         trailing: @escaping (Binding<String>, Focused) -> Trailing)${"$"}{"{"${"$"}{"}"}
        self._text = text
        self.prompt = prompt
        self.leading = leading
        self.trailing = trailing
    ${"$"}{"}"}
    
    var body: some View ${"$"}{"{"${"$"}{"}"}
        HStack(alignment: .center, spacing: nil, content: ${"$"}{"{"${"$"}{"}"}
            leading(${"$"}text, self.editing)
            // for future iOS
            // TextField("title", text: ${"$"}task.title, prompt:Text("Routine name"))
            //                            .focused(${"$"}titleFocused)
            //
            TextField(prompt, text: ${"$"}text, onEditingChanged: ${"$"}{"{"${"$"}{"}"}editing in
                
                    self.editing = editing
                
            ${"$"}{"}"}, onCommit: ${"$"}{"{"${"$"}{"}"}${"$"}{"}"})
            
            trailing(${"$"}text, self.editing)
            
            if(editing)${"$"}{"{"${"$"}{"}"}
                Button(action: ${"$"}{"{"${"$"}{"}"}
                    text = ""
                ${"$"}{"}"}, label: ${"$"}{"{"${"$"}{"}"}
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.secondary)
                ${"$"}{"}"})
            ${"$"}{"}"}
        ${"$"}{"}"})
    ${"$"}{"}"}
${"$"}{"}"}

extension HIGTextField${"$"}{"{"${"$"}{"}"}
    // 前後に何の機能もないパターン
    init(text:Binding<String>, prompt:String) where Leading == EmptyView, Trailing == EmptyView${"$"}{"{"${"$"}{"}"}
        self.init(text: text, prompt: prompt, leading: ${"$"}{"{"${"$"}{"}"}(b, f) in EmptyView()${"$"}{"}"}, trailing: ${"$"}{"{"${"$"}{"}"}(b, f) in EmptyView()${"$"}{"}"})
    ${"$"}{"}"}
    
    // 先頭にUIを追加するパターン
    init(text:Binding<String>, prompt:String, leading:@escaping (Binding<String>, Focused) -> Leading) where Trailing == EmptyView${"$"}{"{"${"$"}{"}"}
        self.init(text: text, prompt: prompt, leading: leading, trailing: ${"$"}{"{"${"$"}{"}"}(b, f) in EmptyView()${"$"}{"}"})
    ${"$"}{"}"}
    
    // 末尾にUIを追加するパターン
    init(text:Binding<String>, prompt:String, trailing:@escaping (Binding<String>, Focused) -> Trailing) where Leading == EmptyView${"$"}{"{"${"$"}{"}"}
        self.init(text: text, prompt: prompt, leading: ${"$"}{"{"${"$"}{"}"}(b, f) in EmptyView()${"$"}{"}"}, trailing: trailing)
    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

## 結果

おおよそのパターンに対応できそうな汎用的なTextFieldができました。
`,coediting: false,comments_count: 0,created_at: '2021-12-07T22:48:48+09:00',group: '{ }',id: 'cafa6a4e13db71d54eea',likes_count: 1,private: false,reactions_count: 0,tags: [{name: 'Swift',versions: [  ]},{name: 'textField',versions: [  ]},{name: 'SwiftUI',versions: [  ]},{name: 'HumanInterfaceGuidelines',versions: [  ]}],title: 'SwiftUI: Human Interface Guidelinesに沿ったTextField',updated_at: '2021-12-07T22:51:23+09:00',url: 'https://qiita.com/sYamaz/items/cafa6a4e13db71d54eea',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>仕事ではdotnet（C#）アプリ開発、プライベートでSwift/SwiftUIでiOSアプリの開発をしています。<br>
現在AppStoreへの初リリースを目標に黙々と手を動かしている途中ですが、その際に得られた感覚について共有できればと思います。<br>
万人に共通するわけではないと思いますが誰かの気づきの一助になれば幸いです。</p>

<h1>
<span id="今までの経験に対して期待しすぎない" class="fragment"></span><a href="#%E4%BB%8A%E3%81%BE%E3%81%A7%E3%81%AE%E7%B5%8C%E9%A8%93%E3%81%AB%E5%AF%BE%E3%81%97%E3%81%A6%E6%9C%9F%E5%BE%85%E3%81%97%E3%81%99%E3%81%8E%E3%81%AA%E3%81%84"><i class="fa fa-link"></i></a>今までの経験に対して期待しすぎない</h1>

<p>Swift/SwiftUIについては見習いレベルですが、dotnet(C#)開発をそこそこやってきたという見栄により「ちゃんと設計しなきゃ」という意識が働き、最初にしっかりと設計をしてからコーディングに移ろうとしていました。</p>

<p>その際の図（ちょっと変則的なTODOアプリをClean architecture、あわよくばVIPERパターンに則って作ろうとしていました）</p>

<p><a href="https://camo.qiitausercontent.com/8db59f8107479a18a1de8c439f0f7203f12c6292/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f39313965303735662d356265642d633638352d626630302d6563653238323961303333652e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F919e075f-5bed-c685-bf00-ece2829a033e.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=26cc9049792210ffb9940acb6b51b070" alt="RoutineCommander-Classのコピー.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/919e075f-5bed-c685-bf00-ece2829a033e.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F919e075f-5bed-c685-bf00-ece2829a033e.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=e415a6d7f2f0cabe188122ac930daef3 1x" loading="lazy"></a></p>

<p>結果、Swiftの言語使用等を十分に理解してない中での設計ということもあり、上記設計での実現は困難な部分が多く断念しました。断念するまでは設計のし直しなどかなり手間をかけていたと思います。<br>
現在は、多少汚いコードでもいいからまずは動くものを完成させることを最優先に実装を進めています。</p>

<p>ちゃんと設計することで可読性やメンテナンス性の向上など期待できることは多いですが、初心者のうちはまだそのステージに立っていない（特に独自で設計するとき）ことを自覚しないといつまでたってもリリースできないことに気がつきました</p>
`,body: `仕事ではdotnet（C#）アプリ開発、プライベートでSwift/SwiftUIでiOSアプリの開発をしています。
現在AppStoreへの初リリースを目標に黙々と手を動かしている途中ですが、その際に得られた感覚について共有できればと思います。
万人に共通するわけではないと思いますが誰かの気づきの一助になれば幸いです。

# 今までの経験に対して期待しすぎない

Swift/SwiftUIについては見習いレベルですが、dotnet(C#)開発をそこそこやってきたという見栄により「ちゃんと設計しなきゃ」という意識が働き、最初にしっかりと設計をしてからコーディングに移ろうとしていました。

その際の図（ちょっと変則的なTODOアプリをClean architecture、あわよくばVIPERパターンに則って作ろうとしていました）

![RoutineCommander-Classのコピー.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/919e075f-5bed-c685-bf00-ece2829a033e.png)

結果、Swiftの言語使用等を十分に理解してない中での設計ということもあり、上記設計での実現は困難な部分が多く断念しました。断念するまでは設計のし直しなどかなり手間をかけていたと思います。
現在は、多少汚いコードでもいいからまずは動くものを完成させることを最優先に実装を進めています。

ちゃんと設計することで可読性やメンテナンス性の向上など期待できることは多いですが、初心者のうちはまだそのステージに立っていない（特に独自で設計するとき）ことを自覚しないといつまでたってもリリースできないことに気がつきました
`,coediting: false,comments_count: 0,created_at: '2021-11-27T23:44:02+09:00',group: '{ }',id: 'cfc3f1bbd0b3cb512a19',likes_count: 4,private: false,reactions_count: 0,tags: [{name: '初心者',versions: [  ]},{name: '考え方',versions: [  ]}],title: '新たなプログラミング言語に挑戦するときは見栄を捨てようという話',updated_at: '2021-11-27T23:44:02+09:00',url: 'https://qiita.com/sYamaz/items/cfc3f1bbd0b3cb512a19',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>趣味でSwiftをいじっている私ですが<code>@Published</code>プロパティラッパーとかを見て、「dotnetアプリ開発でお世話になっているReactivePropertyっぽいな...」と思ってました。</p>

<p><qiita-embed-ogp src="https://github.com/runceel/ReactiveProperty"></qiita-embed-ogp></p>

<p>ってことはとっつきやすいのでは？と思い<a href="https://qiita.com/sYamaz/items/7b72e26ed48579eb814b" id="reference-3414bd93f26e94155ba1">SwiftUI/Swift: 既存のプロジェクトをMVVMパターンに変更する - Qiita</a>で<code>@Published</code>等を使ってみたのですが、２時間くらいハマった出来事があったので共有します。</p>

<h1>
<span id="ハマったこと" class="fragment"></span><a href="#%E3%83%8F%E3%83%9E%E3%81%A3%E3%81%9F%E3%81%93%E3%81%A8"><i class="fa fa-link"></i></a>ハマったこと</h1>

<p><code>@Published var value:T</code>の値を変更しているのに監視側で定義した<code>sink()</code>内の処理が実行されない</p>

<h1>
<span id="状況再現アプリ" class="fragment"></span><a href="#%E7%8A%B6%E6%B3%81%E5%86%8D%E7%8F%BE%E3%82%A2%E3%83%97%E3%83%AA"><i class="fa fa-link"></i></a>状況再現アプリ</h1>

<p>ボタンとカウント表示があるだけのカウントアップアプリを作ります。</p>

<p>C#でもSwiftでも、<code>ボタンをクリックするとModelの値が＋１されて、その変更通知がViewに届く</code>という作りです。</p>

<h1>
<span id="環境" class="fragment"></span><a href="#%E7%92%B0%E5%A2%83"><i class="fa fa-link"></i></a>環境</h1>

<ul>
<li>dotnet WPF app

<ul>
<li>dotnet5</li>
<li>ReactiveProperty 7.12.0</li>
</ul>
</li>
<li>Swift app

<ul>
<li>XCode 13</li>
<li>Swift 5</li>
</ul>
</li>
</ul>

<h1>
<span id="dotnet-wpf-app" class="fragment"></span><a href="#dotnet-wpf-app"><i class="fa fa-link"></i></a>dotnet WPF app</h1>

<p>今回論点となるViewModel。<code>Subscribe()</code>の戻り値であるIDisposableはクラスのフィールドとして参照を保持していなくてもカウントアップした結果はViewにまで到達します。</p>

<div class="code-frame" data-lang="csharp"><div class="highlight"><pre><code>    <span class="k">public</span> <span class="k">class</span> <span class="nc">MainWindowViewModel</span>
    <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="c1">// model</span>
        <span class="k">private</span> <span class="n">CountStore</span> <span class="n">store</span> <span class="p">=</span> <span class="k">new</span> <span class="nf">CountStore</span><span class="p">();</span>

        <span class="k">public</span> <span class="nf">MainWindowViewModel</span><span class="p">()</span>
        <span class="p">${"$"}{"{"${"$"}{"}"}</span>
            <span class="k">this</span><span class="p">.</span><span class="n">CountUpCommand</span> <span class="p">=</span> <span class="k">new</span> <span class="nf">RelayCommand</span><span class="p">(</span><span class="n">_</span> <span class="p">=&gt;</span> <span class="n">store</span><span class="p">.</span><span class="nf">CountUp</span><span class="p">());</span>
            <span class="n">Count</span> <span class="p">=</span> <span class="k">new</span> <span class="n">ReactiveProperty</span><span class="p">&lt;</span><span class="kt">int</span><span class="p">&gt;(</span><span class="n">store</span><span class="p">.</span><span class="n">Count</span><span class="p">.</span><span class="n">Value</span><span class="p">);</span>

            <span class="kt">var</span> <span class="n">_</span> <span class="p">=</span> <span class="n">store</span><span class="p">.</span><span class="n">Count</span><span class="p">.</span><span class="nf">Subscribe</span><span class="p">(</span><span class="n">onNext</span><span class="p">:</span> <span class="n">count</span> <span class="p">=&gt;</span> <span class="k">this</span><span class="p">.</span><span class="n">Count</span><span class="p">.</span><span class="n">Value</span> <span class="p">=</span> <span class="n">count</span><span class="p">);</span>
        <span class="p">${"$"}{"}"}</span>

        <span class="c1">// ボタンクリック時に実行されるCommand</span>
        <span class="k">public</span> <span class="n">ICommand</span> <span class="n">CountUpCommand</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="k">get</span><span class="p">;</span> <span class="p">${"$"}{"}"}</span>
        <span class="c1">// Modelの値が反映されるプロパティ</span>
        <span class="k">public</span> <span class="n">ReactiveProperty</span><span class="p">&lt;</span><span class="kt">int</span><span class="p">&gt;</span> <span class="n">Count</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="k">get</span><span class="p">;</span> <span class="k">private</span> <span class="k">set</span><span class="p">;</span> <span class="p">${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<p>CountStore.cs　カウントアップした値を保持するクラスです</p>

<div class="code-frame" data-lang="csharp"><div class="highlight"><pre><code>    <span class="k">public</span> <span class="k">class</span> <span class="nc">CountStore</span>
    <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">public</span> <span class="nf">CountStore</span><span class="p">()</span>
        <span class="p">${"$"}{"{"${"$"}{"}"}</span>
            <span class="n">Count</span> <span class="p">=</span> <span class="k">new</span> <span class="n">ReactiveProperty</span><span class="p">&lt;</span><span class="kt">int</span><span class="p">&gt;(</span><span class="m">0</span><span class="p">);</span>
        <span class="p">${"$"}{"}"}</span>
        <span class="k">public</span> <span class="n">ReactiveProperty</span><span class="p">&lt;</span><span class="kt">int</span><span class="p">&gt;</span> <span class="n">Count</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="k">get</span><span class="p">;</span> <span class="k">private</span> <span class="k">set</span><span class="p">;</span> <span class="p">${"$"}{"}"}</span>
        <span class="k">public</span> <span class="k">void</span> <span class="nf">CountUp</span><span class="p">()</span>
        <span class="p">${"$"}{"{"${"$"}{"}"}</span>
            <span class="n">Count</span><span class="p">.</span><span class="n">Value</span><span class="p">++;</span>
        <span class="p">${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<p>View(コードビハインドは無し）</p>

<div class="code-frame" data-lang="xml"><div class="highlight"><pre><code><span class="nt">&lt;Window</span> <span class="na">x:Class=</span><span class="s">"WpfApp1.MainWindow"</span>
        <span class="na">xmlns=</span><span class="s">"http://schemas.microsoft.com/winfx/2006/xaml/presentation"</span>
        <span class="na">xmlns:x=</span><span class="s">"http://schemas.microsoft.com/winfx/2006/xaml"</span>
        <span class="na">xmlns:d=</span><span class="s">"http://schemas.microsoft.com/expression/blend/2008"</span>
        <span class="na">xmlns:mc=</span><span class="s">"http://schemas.openxmlformats.org/markup-compatibility/2006"</span>
        <span class="na">xmlns:local=</span><span class="s">"clr-namespace:WpfApp1"</span>
        <span class="na">mc:Ignorable=</span><span class="s">"d"</span>
        <span class="na">Title=</span><span class="s">"MainWindow"</span> <span class="na">Height=</span><span class="s">"450"</span> <span class="na">Width=</span><span class="s">"800"</span><span class="nt">&gt;</span>
    <span class="nt">&lt;Window.DataContext&gt;</span>
        <span class="nt">&lt;local:MainWindowViewModel/&gt;</span>
    <span class="nt">&lt;/Window.DataContext&gt;</span>
    <span class="nt">&lt;Grid&gt;</span>
        <span class="nt">&lt;StackPanel&gt;</span>
            <span class="nt">&lt;TextBlock</span> <span class="na">Text=</span><span class="s">"${"$"}{"{"${"$"}{"}"}Binding Count.Value${"$"}{"}"}"</span> <span class="na">TextAlignment=</span><span class="s">"Center"</span><span class="nt">/&gt;</span>
            <span class="nt">&lt;Button</span> <span class="na">Command=</span><span class="s">"${"$"}{"{"${"$"}{"}"}Binding CountUpCommand${"$"}{"}"}"</span> <span class="nt">&gt;</span>Count up<span class="nt">&lt;/Button&gt;</span>
        <span class="nt">&lt;/StackPanel&gt;</span>
    <span class="nt">&lt;/Grid&gt;</span>
<span class="nt">&lt;/Window&gt;</span>
</code></pre></div></div>

<p>結果、ちゃんとカウントアップします。</p>

<p><a href="https://camo.qiitausercontent.com/45e68d1667d82543f4a75cb7ed6d2075cd12395a/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f35343663313738312d346233622d656465352d656361642d6164386238653366646564382e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F546c1781-4b3b-ede5-ecad-ad8b8e3fded8.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=53267a09ce36d708717e9f8ae5037f5b" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/546c1781-4b3b-ede5-ecad-ad8b8e3fded8.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F546c1781-4b3b-ede5-ecad-ad8b8e3fded8.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=f33a4b7cae75c14d882410d48bb2757f 1x" loading="lazy"></a></p>

<h1>
<span id="swift-ios-app" class="fragment"></span><a href="#swift-ios-app"><i class="fa fa-link"></i></a>Swift iOS app</h1>

<p>ViewModel</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">class</span> <span class="kt">ContentViewModel</span><span class="p">:</span> <span class="kt">ObservableObject</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="c1">// modelの値が反映されるプロパティ</span>
    <span class="kd">@Published</span> <span class="kd">private</span> <span class="p">(</span><span class="k">set</span><span class="p">)</span> <span class="k">var</span> <span class="nv">value</span><span class="p">:</span><span class="kt">Int</span> <span class="o">=</span> <span class="o">-</span><span class="mi">1</span>
    <span class="kd">private</span> <span class="k">let</span> <span class="nv">store</span><span class="p">:</span><span class="kt">CounterStore</span> <span class="o">=</span> <span class="o">.</span><span class="nf">init</span><span class="p">()</span>
    <span class="nf">init</span><span class="p">()${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">let</span> <span class="nv">_</span> <span class="o">=</span> <span class="n">store</span><span class="o">.</span><span class="err">${"$"}</span><span class="n">count</span><span class="o">.</span><span class="nf">sink</span><span class="p">(</span><span class="nv">receiveValue</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span><span class="n">count</span> <span class="k">in</span> <span class="k">self</span><span class="o">.</span><span class="n">value</span> <span class="o">=</span> <span class="n">count</span><span class="p">${"$"}{"}"})</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="c1">// ボタンクリック時に実行される関数</span>
    <span class="kd">public</span> <span class="kd">func</span> <span class="nf">countUp</span><span class="p">()</span> <span class="o">-&gt;</span> <span class="kt">Void</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="n">store</span><span class="o">.</span><span class="nf">countUp</span><span class="p">()</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<p>CountStore</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">class</span> <span class="kt">CounterStore</span><span class="p">:</span> <span class="kt">ObservableObject</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">@Published</span> <span class="kd">private</span> <span class="p">(</span><span class="k">set</span><span class="p">)</span> <span class="k">var</span> <span class="nv">count</span><span class="p">:</span><span class="kt">Int</span> <span class="o">=</span> <span class="mi">0</span>
    <span class="kd">public</span> <span class="kd">func</span> <span class="nf">countUp</span><span class="p">()</span> <span class="o">-&gt;</span> <span class="kt">Void</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="n">count</span> <span class="o">+=</span> <span class="mi">1</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<p>View</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">struct</span> <span class="kt">ContentView</span><span class="p">:</span> <span class="kt">View</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">@ObservedObject</span> <span class="k">var</span> <span class="nv">vm</span> <span class="o">=</span> <span class="kt">ContentViewModel</span><span class="p">()</span>
    <span class="k">var</span> <span class="nv">body</span><span class="p">:</span> <span class="kd">some</span> <span class="kt">View</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="kt">VStack</span><span class="p">(</span><span class="nv">alignment</span><span class="p">:</span> <span class="o">.</span><span class="n">center</span><span class="p">,</span> <span class="nv">spacing</span><span class="p">:</span> <span class="kc">nil</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
            <span class="kt">Text</span><span class="p">(</span><span class="s">"</span><span class="se">\\(</span><span class="n">vm</span><span class="o">.</span><span class="n">value</span><span class="se">)</span><span class="s">"</span><span class="p">)</span><span class="o">.</span><span class="nf">padding</span><span class="p">()</span>
            <span class="kt">Button</span><span class="p">(</span><span class="s">"Count up"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span><span class="n">vm</span><span class="o">.</span><span class="nf">countUp</span><span class="p">()${"$"}{"}"}</span>
        <span class="p">${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<p>結果、カウントアップしないです。ボタンをクリックしてもずっと０のまま。</p>

<p><a href="https://camo.qiitausercontent.com/efdc4e3033f2314e8f04e7af3726eb58699934f3/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f33623066643863632d343961342d333032322d316234632d6639396430353661363561362e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F3b0fd8cc-49a4-3022-1b4c-f99d056a65a6.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=e25d367ab1988934bc4f0661803ca6a8" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/3b0fd8cc-49a4-3022-1b4c-f99d056a65a6.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F3b0fd8cc-49a4-3022-1b4c-f99d056a65a6.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=6ceed34894d2868dc87bc94aa4397a7b 1x" loading="lazy"></a></p>

<h1>
<span id="どういうことなのか" class="fragment"></span><a href="#%E3%81%A9%E3%81%86%E3%81%84%E3%81%86%E3%81%93%E3%81%A8%E3%81%AA%E3%81%AE%E3%81%8B"><i class="fa fa-link"></i></a>どういうことなのか</h1>

<p>公式ドキュメント[<a href="https://developer.apple.com/documentation/combine/anycancellable" rel="nofollow noopener" target="_blank">AnyCancellable - developper.apple.com</a>]より</p>

<blockquote>
<p>An AnyCancellable instance automatically calls cancel() when deinitialized.　（意訳：保持しとかないと使い終わったとみなして勝手にキャンセルするぞ）</p>
</blockquote>

<p>SwiftではARCという名のメモリ管理が行われているらしく、この件もAnyCancellableへの参照数が0になり即破棄されたため起きた問題だったようです。ARCについては知識として身につけておきたいところです。（ARCについてとても参考になった記事：<a href="https://qiita.com/m__ike_/items/c021e280c5b2c659c59d" id="reference-1edbbf596c43d638eb96">ARCの光と影</a>）</p>

<p>つまり、今回の場合ViewModelを次のようにしてAnyCancellableの参照をキープしておく必要があるわけです。</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">class</span> <span class="kt">ContentViewModel</span><span class="p">:</span> <span class="kt">ObservableObject</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">@Published</span> <span class="kd">private</span> <span class="p">(</span><span class="k">set</span><span class="p">)</span> <span class="k">var</span> <span class="nv">value</span><span class="p">:</span><span class="kt">Int</span> <span class="o">=</span> <span class="o">-</span><span class="mi">1</span>
    <span class="kd">private</span> <span class="k">let</span> <span class="nv">store</span><span class="p">:</span><span class="kt">CounterStore</span> <span class="o">=</span> <span class="o">.</span><span class="nf">init</span><span class="p">()</span>
    <span class="kd">private</span> <span class="k">var</span> <span class="nv">subscriptions</span> <span class="o">=</span> <span class="kt">Set</span><span class="o">&lt;</span><span class="kt">AnyCancellable</span><span class="o">&gt;</span><span class="p">()</span>
    <span class="nf">init</span><span class="p">()${"$"}{"{"${"$"}{"}"}</span>
        <span class="c1">// NG: init()のスコープを抜けると破棄される</span>
        <span class="c1">//let _ = store.${"$"}count.sink(receiveValue: ${"$"}{"{"${"$"}{"}"}count in self.value = count${"$"}{"}"})</span>

        <span class="c1">// OK: Set&lt;AnyCancellable&gt;に保持しておくことで参照が保たれる</span>
        <span class="n">store</span><span class="o">.</span><span class="err">${"$"}</span><span class="n">count</span><span class="o">.</span><span class="nf">sink</span><span class="p">(</span><span class="nv">receiveValue</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span><span class="n">count</span> <span class="k">in</span> <span class="k">self</span><span class="o">.</span><span class="n">value</span> <span class="o">=</span> <span class="n">count</span><span class="p">${"$"}{"}"})</span><span class="o">.</span><span class="nf">store</span><span class="p">(</span><span class="nv">in</span><span class="p">:</span> <span class="o">&amp;</span><span class="n">subscriptions</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">public</span> <span class="kd">func</span> <span class="nf">countUp</span><span class="p">()</span> <span class="o">-&gt;</span> <span class="kt">Void</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="n">store</span><span class="o">.</span><span class="nf">countUp</span><span class="p">()</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<p>OK！</p>

<p><a href="https://camo.qiitausercontent.com/45e8e8a45da95ea73701fc5b5c804fda8f0168b9/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f37386161346530642d333762652d623765342d393765382d3734646561333366303436342e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F78aa4e0d-37be-b7e4-97e8-74dea33f0464.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=806090bd6ed4029e79216152fc3c65ff" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/78aa4e0d-37be-b7e4-97e8-74dea33f0464.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F78aa4e0d-37be-b7e4-97e8-74dea33f0464.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=4138ca38a7f80d99dd4e3b8198b930d7 1x" loading="lazy"></a></p>
`,body: `趣味でSwiftをいじっている私ですが\`@Published\`プロパティラッパーとかを見て、「dotnetアプリ開発でお世話になっているReactivePropertyっぽいな...」と思ってました。

https://github.com/runceel/ReactiveProperty

ってことはとっつきやすいのでは？と思い[SwiftUI/Swift: 既存のプロジェクトをMVVMパターンに変更する - Qiita](https://qiita.com/sYamaz/items/7b72e26ed48579eb814b)で\`@Published\`等を使ってみたのですが、２時間くらいハマった出来事があったので共有します。

# ハマったこと

\`@Published var value:T\`の値を変更しているのに監視側で定義した\`sink()\`内の処理が実行されない

# 状況再現アプリ

ボタンとカウント表示があるだけのカウントアップアプリを作ります。

C#でもSwiftでも、\`ボタンをクリックするとModelの値が＋１されて、その変更通知がViewに届く\`という作りです。

# 環境

* dotnet WPF app
    * dotnet5
    * ReactiveProperty 7.12.0
* Swift app
    * XCode 13
    * Swift 5


# dotnet WPF app

今回論点となるViewModel。\`Subscribe()\`の戻り値であるIDisposableはクラスのフィールドとして参照を保持していなくてもカウントアップした結果はViewにまで到達します。

\`\`\`csharp
    public class MainWindowViewModel
    ${"$"}{"{"${"$"}{"}"}
        // model
        private CountStore store = new CountStore();

        public MainWindowViewModel()
        ${"$"}{"{"${"$"}{"}"}
            this.CountUpCommand = new RelayCommand(_ => store.CountUp());
            Count = new ReactiveProperty<int>(store.Count.Value);

            var _ = store.Count.Subscribe(onNext: count => this.Count.Value = count);
        ${"$"}{"}"}

        // ボタンクリック時に実行されるCommand
        public ICommand CountUpCommand ${"$"}{"{"${"$"}{"}"} get; ${"$"}{"}"}
        // Modelの値が反映されるプロパティ
        public ReactiveProperty<int> Count ${"$"}{"{"${"$"}{"}"} get; private set; ${"$"}{"}"}
    ${"$"}{"}"}
\`\`\`

CountStore.cs　カウントアップした値を保持するクラスです

\`\`\`csharp
    public class CountStore
    ${"$"}{"{"${"$"}{"}"}
        public CountStore()
        ${"$"}{"{"${"$"}{"}"}
            Count = new ReactiveProperty<int>(0);
        ${"$"}{"}"}
        public ReactiveProperty<int> Count ${"$"}{"{"${"$"}{"}"} get; private set; ${"$"}{"}"}
        public void CountUp()
        ${"$"}{"{"${"$"}{"}"}
            Count.Value++;
        ${"$"}{"}"}
    ${"$"}{"}"}
\`\`\`

View(コードビハインドは無し）

\`\`\`xml
<Window x:Class="WpfApp1.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:WpfApp1"
        mc:Ignorable="d"
        Title="MainWindow" Height="450" Width="800">
    <Window.DataContext>
        <local:MainWindowViewModel/>
    </Window.DataContext>
    <Grid>
        <StackPanel>
            <TextBlock Text="${"$"}{"{"${"$"}{"}"}Binding Count.Value${"$"}{"}"}" TextAlignment="Center"/>
            <Button Command="${"$"}{"{"${"$"}{"}"}Binding CountUpCommand${"$"}{"}"}" >Count up</Button>
        </StackPanel>
    </Grid>
</Window>
\`\`\`



結果、ちゃんとカウントアップします。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/546c1781-4b3b-ede5-ecad-ad8b8e3fded8.png)

# Swift iOS app

ViewModel

\`\`\`swift
class ContentViewModel: ObservableObject${"$"}{"{"${"$"}{"}"}
    // modelの値が反映されるプロパティ
    @Published private (set) var value:Int = -1
    private let store:CounterStore = .init()
    init()${"$"}{"{"${"$"}{"}"}
        let _ = store.${"$"}count.sink(receiveValue: ${"$"}{"{"${"$"}{"}"}count in self.value = count${"$"}{"}"})
    ${"$"}{"}"}
    
    // ボタンクリック時に実行される関数
    public func countUp() -> Void${"$"}{"{"${"$"}{"}"}
        store.countUp()
    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

CountStore

\`\`\`swift
class CounterStore: ObservableObject${"$"}{"{"${"$"}{"}"}
    @Published private (set) var count:Int = 0
    public func countUp() -> Void${"$"}{"{"${"$"}{"}"}
        count += 1
    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

View

\`\`\`swift
struct ContentView: View ${"$"}{"{"${"$"}{"}"}
    @ObservedObject var vm = ContentViewModel()
    var body: some View ${"$"}{"{"${"$"}{"}"}
        VStack(alignment: .center, spacing: nil)${"$"}{"{"${"$"}{"}"}
            Text("\\(vm.value)").padding()
            Button("Count up")${"$"}{"{"${"$"}{"}"}vm.countUp()${"$"}{"}"}
        ${"$"}{"}"}
    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

結果、カウントアップしないです。ボタンをクリックしてもずっと０のまま。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/3b0fd8cc-49a4-3022-1b4c-f99d056a65a6.png)


# どういうことなのか

公式ドキュメント[[AnyCancellable - developper.apple.com](https://developer.apple.com/documentation/combine/anycancellable)]より

> An AnyCancellable instance automatically calls cancel() when deinitialized.　（意訳：保持しとかないと使い終わったとみなして勝手にキャンセルするぞ）

SwiftではARCという名のメモリ管理が行われているらしく、この件もAnyCancellableへの参照数が0になり即破棄されたため起きた問題だったようです。ARCについては知識として身につけておきたいところです。（ARCについてとても参考になった記事：[ARCの光と影](https://qiita.com/m__ike_/items/c021e280c5b2c659c59d)）


つまり、今回の場合ViewModelを次のようにしてAnyCancellableの参照をキープしておく必要があるわけです。

\`\`\`swift
class ContentViewModel: ObservableObject${"$"}{"{"${"$"}{"}"}
    @Published private (set) var value:Int = -1
    private let store:CounterStore = .init()
    private var subscriptions = Set<AnyCancellable>()
    init()${"$"}{"{"${"$"}{"}"}
        // NG: init()のスコープを抜けると破棄される
        //let _ = store.${"$"}count.sink(receiveValue: ${"$"}{"{"${"$"}{"}"}count in self.value = count${"$"}{"}"})
        
        // OK: Set<AnyCancellable>に保持しておくことで参照が保たれる
        store.${"$"}count.sink(receiveValue: ${"$"}{"{"${"$"}{"}"}count in self.value = count${"$"}{"}"}).store(in: &subscriptions)
    ${"$"}{"}"}
    
    public func countUp() -> Void${"$"}{"{"${"$"}{"}"}
        store.countUp()
    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

OK！

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/78aa4e0d-37be-b7e4-97e8-74dea33f0464.png)

`,coediting: false,comments_count: 0,created_at: '2021-10-30T20:27:51+09:00',group: '{ }',id: '56e943c2536397cc41d4',likes_count: 0,private: false,reactions_count: 0,tags: [{name: 'Swift',versions: [  ]},{name: 'ReactiveProperty',versions: [  ]},{name: 'dotnet',versions: [  ]},{name: 'Combine',versions: [  ]},{name: 'dotnetcore',versions: [  ]}],title: 'dotnet慣れした私がSwift CombineのAnyCancellableの取り扱いでハマった話',updated_at: '2021-10-30T20:27:51+09:00',url: 'https://qiita.com/sYamaz/items/56e943c2536397cc41d4',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p><a href="https://qiita.com/sYamaz/items/9ef8fceb5650fc7b7ad8" id="reference-6995fde8c3fa0eb25fc5">体温を最速で入力するためのユーザーインターフェースの検討(その1) - Qiita</a>で体温入力のユーザーインターフェースを考えていました。</p>

<p><a href="https://camo.qiitausercontent.com/46e7710c56e7d2ff88ce9381adc1d37869379798/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f38383238326330322d613538642d636566342d326132382d3333343131656166656433302e676966" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F88282c02-a58d-cef4-2a28-33411eafed30.gif?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=b10cc6dae9aaf1acec2aa284de125c66" alt="タイトルなし.gif" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/88282c02-a58d-cef4-2a28-33411eafed30.gif" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F88282c02-a58d-cef4-2a28-33411eafed30.gif?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=9e42e486d8a5ded7e523a609cbfd64e3 1x" loading="lazy"></a></p>

<p>前回は「とりあえず作った」だけの物だったので今後の変更やテストしやすさなどを考えてMVVMパターンに合わせていこうと思います。</p>

<p>本来このようなリファクタリングはユニットテストをあらかじめ作った上で実施していくものだと思いますが、あまりにテストしにくい形だったため今回は先に設計を変更することにしました。</p>

<p>環境は以下です</p>

<ul>
<li>Xcode 13</li>
<li>Swift 5</li>
</ul>

<h2>
<span id="before" class="fragment"></span><a href="#before"><i class="fa fa-link"></i></a>before</h2>

<p><qiita-embed-ogp src="https://github.com/sYamaz/BodyTempLogger/tree/v0.0.1"></qiita-embed-ogp></p>

<p>クラス、構造体の関連を示すと以下のようなイメージです。</p>

<p><a href="https://camo.qiitausercontent.com/2458396b9e6931eed0814b0347cdb84b22175899/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f34376531396130382d393536632d626637372d333939372d6439333134333263373339392e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F47e19a08-956c-bf77-3997-d931432c7399.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=59d12d82ff695e454de10b43d402da85" alt="名称未設定ファイル-before.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/47e19a08-956c-bf77-3997-d931432c7399.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F47e19a08-956c-bf77-3997-d931432c7399.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=4d66c7d81849d8f3626584a1b0a97049 1x" loading="lazy"></a></p>

<ul>
<li>AppDelegate；アプリケーション起動時の処理を行うクラス</li>
<li>PostView：保存ボタン</li>
<li>TapInputView：体温入力のためのボタンがあるView（と、その他分離できていない機能群）

<ul>
<li>その他の機能</li>
<li>ユーザー設定のためのシート表示</li>
<li>現在入力している値の表示</li>
</ul>
</li>
<li>HealthCareRepository：HealthKitへのアクセスを担当するクラス</li>
<li>HealthCareRepositoryDelegate：HealthKitへのアクセスのインターフェース（Protocol）。主にテストを容易にするためのもの</li>
</ul>

<p>無計画にViewを作成しており、かつ状態は全てViewが持っています。</p>

<h2>
<span id="after" class="fragment"></span><a href="#after"><i class="fa fa-link"></i></a>after</h2>

<p>MVVMでModel部分をどのように作るかが私の中で定まっていないですが今回は以下のようなパターンを考えます</p>

<p><a href="https://camo.qiitausercontent.com/5309dcd4c719311934de8a8a459d46c1601e13e4/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f30346436656137332d353034652d306137632d396163372d6663343735663732646262612e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F04d6ea73-504e-0a7c-9ac7-fc475f72dbba.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=ba0ae3ceac06edfb620eeb5c47ca7686" alt="名称未設定ファイル-after.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/04d6ea73-504e-0a7c-9ac7-fc475f72dbba.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F04d6ea73-504e-0a7c-9ac7-fc475f72dbba.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=35370fbc0c3b70985718500e35e824e1 1x" loading="lazy"></a></p>

<ul>
<li>View</li>
<li>ViewModel</li>
<li>Model

<ul>
<li>Store: アプリケーションの状態を保持するクラス</li>
<li>Value: アプリケーションの状態（構造体）</li>
<li>Repository: 外部のAPIアクセスを隠蔽する。今回はHealthKit。</li>
</ul>
</li>
</ul>

<p>状態を構造体一発ではなくStoreとValueという形にしたのは状態の変更とそれを通知する機能を状態そのものから分離したかったためです。</p>

<p>このパターンをもとに、以下のように設計を変更しました</p>

<p><qiita-embed-ogp src="https://github.com/sYamaz/BodyTempLogger/tree/v0.0.3"></qiita-embed-ogp></p>

<p><a href="https://camo.qiitausercontent.com/2ee646e059231a2d8d026149cc2f8f1818691eb0/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f35666631353233662d306437642d633931622d356438332d6234663062313835376635362e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F5ff1523f-0d7d-c91b-5d83-b4f0b1857f56.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=4b332b84878323795f10e92fbf221967" alt="名称未設定ファイル-after2.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/5ff1523f-0d7d-c91b-5d83-b4f0b1857f56.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F5ff1523f-0d7d-c91b-5d83-b4f0b1857f56.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=ab1a1478496f5df729d00b2ef8dc4ee1 1x" loading="lazy"></a></p>

<p>ユーザー設定に関しては<code>PreferenceStore</code>, 入力中の体温値に関しては<code>TemperatureStore</code>が管理してます。</p>

<p>TapInputViewに詰め込んでいたユーザー設定や現在値の表示を分離し、ViewModelを作成しています</p>

<p>参考までに一番コードがシンプルなDisplayViewに関するView/ViewModel/Model(Store/Value)のコードを載せておきます。</p>

<h3>
<span id="displayviewview" class="fragment"></span><a href="#displayviewview"><i class="fa fa-link"></i></a>DisplayView(View)</h3>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">SwiftUI</span>

<span class="kd">extension</span> <span class="kt">DisplayView</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">private</span> <span class="nf">init</span><span class="p">(</span><span class="nv">vm</span><span class="p">:</span><span class="kt">DisplayViewModel</span><span class="p">,</span> <span class="nv">upperColor</span><span class="p">:</span><span class="kt">Color</span><span class="p">,</span> <span class="nv">lowerColor</span><span class="p">:</span><span class="kt">Color</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">self</span><span class="o">.</span><span class="n">vm</span> <span class="o">=</span> <span class="n">vm</span>
        <span class="k">self</span><span class="o">.</span><span class="n">upperValueColor</span> <span class="o">=</span> <span class="n">upperColor</span>
        <span class="k">self</span><span class="o">.</span><span class="n">lowerValueColor</span> <span class="o">=</span> <span class="n">lowerColor</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">func</span> <span class="nf">upperColor</span><span class="p">(</span><span class="n">_</span> <span class="nv">color</span><span class="p">:</span><span class="kt">Color</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="k">Self</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">DisplayView</span><span class="p">(</span><span class="nv">vm</span><span class="p">:</span> <span class="k">self</span><span class="o">.</span><span class="n">vm</span><span class="p">,</span> <span class="nv">upperColor</span><span class="p">:</span> <span class="n">color</span><span class="p">,</span> <span class="nv">lowerColor</span><span class="p">:</span> <span class="k">self</span><span class="o">.</span><span class="n">lowerValueColor</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">func</span> <span class="nf">lowerColor</span><span class="p">(</span><span class="n">_</span> <span class="nv">color</span><span class="p">:</span><span class="kt">Color</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="k">Self</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">DisplayView</span><span class="p">(</span><span class="nv">vm</span><span class="p">:</span> <span class="k">self</span><span class="o">.</span><span class="n">vm</span><span class="p">,</span> <span class="nv">upperColor</span><span class="p">:</span> <span class="k">self</span><span class="o">.</span><span class="n">upperValueColor</span><span class="p">,</span> <span class="nv">lowerColor</span><span class="p">:</span> <span class="n">color</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">DisplayView</span><span class="p">:</span> <span class="kt">View</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="k">let</span> <span class="nv">upperValueColor</span><span class="p">:</span><span class="kt">Color</span>
    <span class="kd">private</span> <span class="k">let</span> <span class="nv">lowerValueColor</span><span class="p">:</span><span class="kt">Color</span>

    <span class="kd">@ObservedObject</span> <span class="kd">private</span> <span class="k">var</span> <span class="nv">vm</span><span class="p">:</span><span class="kt">DisplayViewModel</span>

    <span class="nf">init</span><span class="p">(</span><span class="nv">vm</span><span class="p">:</span><span class="kt">DisplayViewModel</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">self</span><span class="o">.</span><span class="n">vm</span> <span class="o">=</span> <span class="n">vm</span>

        <span class="k">self</span><span class="o">.</span><span class="n">upperValueColor</span> <span class="o">=</span> <span class="kt">Color</span><span class="o">.</span><span class="n">primary</span>
        <span class="k">self</span><span class="o">.</span><span class="n">lowerValueColor</span> <span class="o">=</span> <span class="kt">Color</span><span class="o">.</span><span class="n">primary</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="k">var</span> <span class="nv">body</span><span class="p">:</span> <span class="kd">some</span> <span class="kt">View</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="c1">// 表示</span>
        <span class="kt">HStack</span><span class="p">(</span><span class="nv">alignment</span><span class="p">:</span> <span class="o">.</span><span class="n">firstTextBaseline</span><span class="p">,</span> <span class="nv">spacing</span><span class="p">:</span> <span class="mi">4</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
            <span class="kt">Text</span><span class="p">(</span><span class="s">"</span><span class="se">\\(</span><span class="n">vm</span><span class="o">.</span><span class="n">temp</span><span class="o">.</span><span class="n">higher</span><span class="se">)</span><span class="s">."</span><span class="p">)</span>
                <span class="o">.</span><span class="nf">foregroundColor</span><span class="p">(</span><span class="n">upperValueColor</span><span class="p">)</span>
            <span class="kt">Text</span><span class="p">(</span><span class="s">"</span><span class="se">\\(</span><span class="n">vm</span><span class="o">.</span><span class="n">temp</span><span class="o">.</span><span class="n">lower</span><span class="se">)</span><span class="s">"</span><span class="p">)</span>
                <span class="o">.</span><span class="nf">foregroundColor</span><span class="p">(</span><span class="n">lowerValueColor</span><span class="p">)</span>
            <span class="kt">Text</span><span class="p">(</span><span class="s">"℃"</span><span class="p">)</span><span class="o">.</span><span class="nf">font</span><span class="p">(</span><span class="kt">Font</span><span class="o">.</span><span class="nf">system</span><span class="p">(</span><span class="nv">size</span><span class="p">:</span> <span class="mi">48</span><span class="p">))</span>
        <span class="p">${"$"}{"}"}</span><span class="o">.</span><span class="nf">font</span><span class="p">(</span><span class="kt">Font</span><span class="o">.</span><span class="nf">system</span><span class="p">(</span><span class="nv">size</span><span class="p">:</span> <span class="mi">80</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<h3>
<span id="displayviewmodelviewmodel" class="fragment"></span><a href="#displayviewmodelviewmodel"><i class="fa fa-link"></i></a>DisplayViewModel(ViewModel)</h3>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">Foundation</span>
<span class="kd">import</span> <span class="kt">Combine</span>
<span class="kd">class</span> <span class="kt">DisplayViewModel</span><span class="p">:</span> <span class="kt">ObservableObject</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">private</span> <span class="k">let</span> <span class="nv">healthCareRepository</span><span class="p">:</span> <span class="kt">HealthCareRepositoryDelegate</span>
    <span class="kd">@Published</span> <span class="kd">private</span> <span class="p">(</span><span class="k">set</span><span class="p">)</span> <span class="k">var</span> <span class="nv">temp</span><span class="p">:</span><span class="kt">Temperature</span>

    <span class="kd">private</span> <span class="k">var</span> <span class="nv">cancellable</span><span class="p">:</span><span class="kt">AnyCancellable</span><span class="p">?</span> <span class="o">=</span> <span class="kc">nil</span>

    <span class="nf">init</span><span class="p">(</span><span class="nv">repo</span><span class="p">:</span><span class="kt">HealthCareRepositoryDelegate</span><span class="p">,</span> <span class="nv">store</span><span class="p">:</span><span class="kt">TemperatureStore</span><span class="p">)</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">self</span><span class="o">.</span><span class="n">healthCareRepository</span> <span class="o">=</span> <span class="n">repo</span>
        <span class="k">self</span><span class="o">.</span><span class="n">temp</span> <span class="o">=</span> <span class="n">store</span><span class="o">.</span><span class="n">value</span>

        <span class="k">self</span><span class="o">.</span><span class="n">cancellable</span> <span class="o">=</span> <span class="n">store</span><span class="o">.</span><span class="err">${"$"}</span><span class="n">value</span><span class="o">.</span><span class="nf">sink</span><span class="p">(</span><span class="nv">receiveValue</span><span class="p">:</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span><span class="n">t</span> <span class="k">in</span> <span class="k">self</span><span class="o">.</span><span class="n">temp</span> <span class="o">=</span> <span class="n">t</span><span class="p">${"$"}{"}"})</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>

</code></pre></div></div>

<h3>
<span id="temperaturestoremodel---store" class="fragment"></span><a href="#temperaturestoremodel---store"><i class="fa fa-link"></i></a>TemperatureStore(Model - Store)</h3>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">Foundation</span>
<span class="kd">import</span> <span class="kt">Combine</span>
<span class="kd">class</span> <span class="kt">TemperatureStore</span><span class="p">:</span> <span class="kt">ObservableObject</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>

    <span class="kd">@Published</span> <span class="kd">private</span> <span class="p">(</span><span class="k">set</span><span class="p">)</span> <span class="k">var</span> <span class="nv">value</span><span class="p">:</span><span class="kt">Temperature</span>

    <span class="nf">init</span><span class="p">(</span><span class="n">_</span> <span class="nv">initialValue</span><span class="p">:</span><span class="kt">Temperature</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">self</span><span class="o">.</span><span class="n">value</span> <span class="o">=</span> <span class="n">initialValue</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">func</span> <span class="nf">update</span><span class="p">(</span><span class="n">_</span> <span class="nv">closure</span><span class="p">:(</span><span class="kt">Temperature</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">Temperature</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">Void</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">self</span><span class="o">.</span><span class="n">value</span> <span class="o">=</span> <span class="nf">closure</span><span class="p">(</span><span class="k">self</span><span class="o">.</span><span class="n">value</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>

</code></pre></div></div>

<p>使い方</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="k">let</span> <span class="nv">store</span><span class="p">:</span><span class="kt">TemperatureStore</span>
<span class="c1">// 小数点以下の値を更新する</span>
<span class="n">store</span><span class="o">.</span><span class="nf">update</span><span class="p">(${"$"}{"{"${"$"}{"}"}</span><span class="n">old</span> <span class="k">in</span> <span class="n">old</span><span class="o">.</span><span class="nf">lower</span><span class="p">(</span><span class="mi">9</span><span class="p">))</span>
</code></pre></div></div>

<h3>
<span id="temperaturemodel---value" class="fragment"></span><a href="#temperaturemodel---value"><i class="fa fa-link"></i></a>Temperature(Model - Value)</h3>

<p>今回の用途では、体温の小数点以上/以下それぞれ個別に変更するため以下のような作りにしてます</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">Foundation</span>

<span class="c1">/// 入力中の体温を保持する構造体です</span>
<span class="kd">struct</span> <span class="kt">Temperature</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="c1">/// 小数点以下</span>
    <span class="k">let</span> <span class="nv">lower</span><span class="p">:</span><span class="kt">Int</span>

    <span class="c1">/// 小数点以上</span>
    <span class="k">let</span> <span class="nv">higher</span><span class="p">:</span><span class="kt">Int</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">extension</span> <span class="kt">Temperature</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">public</span> <span class="kd">func</span> <span class="nf">lower</span><span class="p">(</span><span class="n">_</span> <span class="nv">val</span><span class="p">:</span><span class="kt">Int</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="k">Self</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="o">.</span><span class="nf">init</span><span class="p">(</span><span class="nv">lower</span><span class="p">:</span> <span class="n">val</span><span class="p">,</span> <span class="nv">higher</span><span class="p">:</span> <span class="k">self</span><span class="o">.</span><span class="n">higher</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">public</span> <span class="kd">func</span> <span class="nf">higher</span><span class="p">(</span><span class="n">_</span> <span class="nv">val</span><span class="p">:</span><span class="kt">Int</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="k">Self</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="o">.</span><span class="nf">init</span><span class="p">(</span><span class="nv">lower</span><span class="p">:</span> <span class="k">self</span><span class="o">.</span><span class="n">lower</span><span class="p">,</span> <span class="nv">higher</span><span class="p">:</span> <span class="n">val</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>

</code></pre></div></div>

<h2>
<span id="終わりに" class="fragment"></span><a href="#%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AB"><i class="fa fa-link"></i></a>終わりに</h2>

<p>私が現時点でそうだと思っているMVVM化できました。</p>

<p>Store-Value部分は使いやすいかどうか、テストしやすいかどうかなど今後検証してみたいところです。</p>
`,body: `[体温を最速で入力するためのユーザーインターフェースの検討(その1) - Qiita](https://qiita.com/sYamaz/items/9ef8fceb5650fc7b7ad8)で体温入力のユーザーインターフェースを考えていました。

![タイトルなし.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/88282c02-a58d-cef4-2a28-33411eafed30.gif)

前回は「とりあえず作った」だけの物だったので今後の変更やテストしやすさなどを考えてMVVMパターンに合わせていこうと思います。


本来このようなリファクタリングはユニットテストをあらかじめ作った上で実施していくものだと思いますが、あまりにテストしにくい形だったため今回は先に設計を変更することにしました。

環境は以下です

* Xcode 13
* Swift 5

## before

https://github.com/sYamaz/BodyTempLogger/tree/v0.0.1

クラス、構造体の関連を示すと以下のようなイメージです。

![名称未設定ファイル-before.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/47e19a08-956c-bf77-3997-d931432c7399.png)

* AppDelegate；アプリケーション起動時の処理を行うクラス
* PostView：保存ボタン
* TapInputView：体温入力のためのボタンがあるView（と、その他分離できていない機能群）
  * その他の機能
    * ユーザー設定のためのシート表示
    * 現在入力している値の表示
* HealthCareRepository：HealthKitへのアクセスを担当するクラス
* HealthCareRepositoryDelegate：HealthKitへのアクセスのインターフェース（Protocol）。主にテストを容易にするためのもの

無計画にViewを作成しており、かつ状態は全てViewが持っています。

## after

MVVMでModel部分をどのように作るかが私の中で定まっていないですが今回は以下のようなパターンを考えます

![名称未設定ファイル-after.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/04d6ea73-504e-0a7c-9ac7-fc475f72dbba.png)


* View
* ViewModel
* Model
  * Store: アプリケーションの状態を保持するクラス
    * Value: アプリケーションの状態（構造体）
  * Repository: 外部のAPIアクセスを隠蔽する。今回はHealthKit。

状態を構造体一発ではなくStoreとValueという形にしたのは状態の変更とそれを通知する機能を状態そのものから分離したかったためです。

このパターンをもとに、以下のように設計を変更しました

https://github.com/sYamaz/BodyTempLogger/tree/v0.0.3

![名称未設定ファイル-after2.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/5ff1523f-0d7d-c91b-5d83-b4f0b1857f56.png)

ユーザー設定に関しては\`PreferenceStore\`, 入力中の体温値に関しては\`TemperatureStore\`が管理してます。

TapInputViewに詰め込んでいたユーザー設定や現在値の表示を分離し、ViewModelを作成しています



参考までに一番コードがシンプルなDisplayViewに関するView/ViewModel/Model(Store/Value)のコードを載せておきます。

### DisplayView(View)

\`\`\`swift
import SwiftUI

extension DisplayView${"$"}{"{"${"$"}{"}"}
    private init(vm:DisplayViewModel, upperColor:Color, lowerColor:Color)${"$"}{"{"${"$"}{"}"}
        self.vm = vm
        self.upperValueColor = upperColor
        self.lowerValueColor = lowerColor
    ${"$"}{"}"}
    
    func upperColor(_ color:Color) -> Self${"$"}{"{"${"$"}{"}"}
        return DisplayView(vm: self.vm, upperColor: color, lowerColor: self.lowerValueColor)
    ${"$"}{"}"}
    
    func lowerColor(_ color:Color) -> Self${"$"}{"{"${"$"}{"}"}
        return DisplayView(vm: self.vm, upperColor: self.upperValueColor, lowerColor: color)
    ${"$"}{"}"}
${"$"}{"}"}

struct DisplayView: View ${"$"}{"{"${"$"}{"}"}
    
    private let upperValueColor:Color
    private let lowerValueColor:Color
    
    @ObservedObject private var vm:DisplayViewModel
    
    init(vm:DisplayViewModel)${"$"}{"{"${"$"}{"}"}
        self.vm = vm
        
        self.upperValueColor = Color.primary
        self.lowerValueColor = Color.primary
    ${"$"}{"}"}
    
    var body: some View ${"$"}{"{"${"$"}{"}"}
        // 表示
        HStack(alignment: .firstTextBaseline, spacing: 4)${"$"}{"{"${"$"}{"}"}
            Text("\\(vm.temp.higher).")
                .foregroundColor(upperValueColor)
            Text("\\(vm.temp.lower)")
                .foregroundColor(lowerValueColor)
            Text("℃").font(Font.system(size: 48))
        ${"$"}{"}"}.font(Font.system(size: 80))
    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

### DisplayViewModel(ViewModel)


\`\`\`swift
import Foundation
import Combine
class DisplayViewModel: ObservableObject${"$"}{"{"${"$"}{"}"}
    private let healthCareRepository: HealthCareRepositoryDelegate
    @Published private (set) var temp:Temperature
    
    private var cancellable:AnyCancellable? = nil
    
    init(repo:HealthCareRepositoryDelegate, store:TemperatureStore) ${"$"}{"{"${"$"}{"}"}
        self.healthCareRepository = repo
        self.temp = store.value
        
        self.cancellable = store.${"$"}value.sink(receiveValue: ${"$"}{"{"${"$"}{"}"}t in self.temp = t${"$"}{"}"})
    ${"$"}{"}"}
${"$"}{"}"}

\`\`\`

### TemperatureStore(Model - Store)

\`\`\`swift
import Foundation
import Combine
class TemperatureStore: ObservableObject${"$"}{"{"${"$"}{"}"}

    @Published private (set) var value:Temperature
    
    init(_ initialValue:Temperature)${"$"}{"{"${"$"}{"}"}
        self.value = initialValue
    ${"$"}{"}"}
    
    func update(_ closure:(Temperature) -> Temperature) -> Void${"$"}{"{"${"$"}{"}"}
        self.value = closure(self.value)
    ${"$"}{"}"}
${"$"}{"}"}

\`\`\`

使い方

\`\`\`swift
let store:TemperatureStore
// 小数点以下の値を更新する
store.update(${"$"}{"{"${"$"}{"}"}old in old.lower(9))
\`\`\`


### Temperature(Model - Value)

今回の用途では、体温の小数点以上/以下それぞれ個別に変更するため以下のような作りにしてます

\`\`\`swift
import Foundation

/// 入力中の体温を保持する構造体です
struct Temperature${"$"}{"{"${"$"}{"}"}
    /// 小数点以下
    let lower:Int
    
    /// 小数点以上
    let higher:Int
${"$"}{"}"}

extension Temperature${"$"}{"{"${"$"}{"}"}
    public func lower(_ val:Int) -> Self${"$"}{"{"${"$"}{"}"}
        return .init(lower: val, higher: self.higher)
    ${"$"}{"}"}
    
    public func higher(_ val:Int) -> Self${"$"}{"{"${"$"}{"}"}
        return .init(lower: self.lower, higher: val)
    ${"$"}{"}"}
${"$"}{"}"}

\`\`\`

## 終わりに

私が現時点でそうだと思っているMVVM化できました。

Store-Value部分は使いやすいかどうか、テストしやすいかどうかなど今後検証してみたいところです。
`,coediting: false,comments_count: 0,created_at: '2021-10-27T22:30:12+09:00',group: '{ }',id: '7b72e26ed48579eb814b',likes_count: 1,private: false,reactions_count: 0,tags: [{name: 'MVVM',versions: [  ]},{name: 'Swift',versions: [  ]},{name: 'SwiftUI',versions: [  ]}],title: 'SwiftUI/Swift: 既存のプロジェクトをMVVMパターンに変更する',updated_at: '2021-10-27T22:40:45+09:00',url: 'https://qiita.com/sYamaz/items/7b72e26ed48579eb814b',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>体調管理（と会社での感染予防）のために毎朝体温を測るのが習慣化しています。<br>
しかし、朝の1分1秒は非常に貴重な時間です。できればiPhoneでの体温データ入力も極限まで無駄を減らしたいところです。</p>

<p>そこで、体温を最速で入力するためにはどんな入力インターフェースがいいのかを検討してみようと思いました。</p>

<p>HealthKitへの体温データ追加については前回調査しました</p>

<p><a href="https://qiita.com/sYamaz/items/cedfd869f74f14b4b25b" id="reference-edf7ca93e2003fef1e79">Swift: HealthKitに体温データを入力する。できるだけ公式ドキュメントだけを見て。</a></p>

<h1>
<span id="開発環境" class="fragment"></span><a href="#%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83"><i class="fa fa-link"></i></a>開発環境</h1>

<ul>
<li>Xcode 13</li>
<li>swift 5</li>
<li>対象プラットフォーム:iOS 14以上（主にiphone）</li>
</ul>

<h1>
<span id="条件" class="fragment"></span><a href="#%E6%9D%A1%E4%BB%B6"><i class="fa fa-link"></i></a>条件</h1>

<ul>
<li>主なユーザー：私

<ul>
<li>体温の単位は摂氏です</li>
<li>平熱は36℃台中盤で、35℃台になることはありません</li>
<li>40℃台になったことはありません。</li>
</ul>
</li>
</ul>

<h1>
<span id="タップ数ベースの参考記録" class="fragment"></span><a href="#%E3%82%BF%E3%83%83%E3%83%97%E6%95%B0%E3%83%99%E3%83%BC%E3%82%B9%E3%81%AE%E5%8F%82%E8%80%83%E8%A8%98%E9%8C%B2"><i class="fa fa-link"></i></a>タップ数ベースの参考記録</h1>

<p>新規入力時</p>

<ol>
<li>ヘルスケアアプリ起動（1タップ）</li>
<li>お気に入り登録してある「体温」の項目をタップ（1タップ）</li>
<li>「データを追加」をタップ（1タップ）</li>
<li>iOSのソフトウェアキーボードで体温を入力（4タップ:"36.5"など）</li>
<li>「追加」をタップ（1タップ）</li>
</ol>

<p>合計8タップ</p>

<h1>
<span id="ユーザーインターフェースの検討" class="fragment"></span><a href="#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E3%81%AE%E6%A4%9C%E8%A8%8E"><i class="fa fa-link"></i></a>ユーザーインターフェースの検討</h1>

<p>※そもそも体温を測ったらiPhoneと接続して勝手に記録してくれる体温計があればいい話ですがそれは置いておきます。</p>

<p>どんな入力方法があるか考えてみます（実現方法は置いておきます）</p>

<h2>
<span id="画像入力" class="fragment"></span><a href="#%E7%94%BB%E5%83%8F%E5%85%A5%E5%8A%9B"><i class="fa fa-link"></i></a>画像入力</h2>

<p>以下の２方法を思いつきました</p>

<ul>
<li>計測後の体温計にカメラをかざして体温の文字列を読み込む方式</li>
<li>計測後の体温計の写真を撮って解析する方式</li>
</ul>

<p>今後Try予定です</p>

<h2>
<span id="音声入力" class="fragment"></span><a href="#%E9%9F%B3%E5%A3%B0%E5%85%A5%E5%8A%9B"><i class="fa fa-link"></i></a>音声入力</h2>

<p>「Hey Siri！ 今日の体温は36.7度だったよ！」と言う方式です</p>

<p>今後Try予定です</p>

<h2>
<span id="タッチ入力" class="fragment"></span><a href="#%E3%82%BF%E3%83%83%E3%83%81%E5%85%A5%E5%8A%9B"><i class="fa fa-link"></i></a>タッチ入力</h2>

<p>ソフトウェアキーボードをはじめとしたタッチ操作で入力する方式です。</p>

<p>とはいえソフトウェアキーボードを使用したアプリだと上記参考記録とタップ数は大差なくなってしまうので別の方法を考えてみます。</p>

<h3>
<span id="ソフトウェアキーボードじゃダメなの" class="fragment"></span><a href="#%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E3%81%98%E3%82%83%E3%83%80%E3%83%A1%E3%81%AA%E3%81%AE"><i class="fa fa-link"></i></a>ソフトウェアキーボードじゃダメなの？</h3>

<p>※1秒を惜しむ人間の思考です</p>

<ul>
<li>仮に体温が「36.5度」だったとして、「3」と「.」は入力しなくて良のではないでしょうか？大抵変わるのは「6」と「5」の部分です。冒頭で示したように40度行くことはほぼないです。</li>
<li>修正するときにBackSpace入力するのがめんどくさいという思いもあります</li>
</ul>

<p>これらに対して、「小数点以上」「小数点以下」それぞれで上書きで入力することができればいいのでは？と思い作成したプロトタイプが以下になります。</p>

<p><a href="https://camo.qiitausercontent.com/46e7710c56e7d2ff88ce9381adc1d37869379798/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f38383238326330322d613538642d636566342d326132382d3333343131656166656433302e676966" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F88282c02-a58d-cef4-2a28-33411eafed30.gif?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=b10cc6dae9aaf1acec2aa284de125c66" alt="タイトルなし.gif" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/88282c02-a58d-cef4-2a28-33411eafed30.gif" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F88282c02-a58d-cef4-2a28-33411eafed30.gif?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=9e42e486d8a5ded7e523a609cbfd64e3 1x" loading="lazy"></a></p>

<p>理想的には</p>

<ul>
<li>アプリ起動（1タップ）</li>
<li>小数点以上の桁入力（1タップ。平熱の場合タップ無しになることも）</li>
<li>小数点以下の桁入力（1タップ）</li>
<li>登録ボタン（1タップ）</li>
</ul>

<p>合計4タップ</p>

<p>小数点以上、以下それぞれ独立して数値を上書きしていくため、入力後の修正もBackSpace不要です</p>

<h1>
<span id="repository" class="fragment"></span><a href="#repository"><i class="fa fa-link"></i></a>repository</h1>

<p><qiita-embed-ogp src="https://github.com/sYamaz/BodyTempLogger"></qiita-embed-ogp></p>

<h1>
<span id="結果" class="fragment"></span><a href="#%E7%B5%90%E6%9E%9C"><i class="fa fa-link"></i></a>結果</h1>

<p>今回は使用者を限定することで理論上ではタップ数が半減するインターフェースとなりました。</p>

<p>次回以降試してみたいことの一覧です</p>

<ul>
<li>タッチ入力

<ul>
<li>スワイプなどの操作も活用できないか</li>
</ul>
</li>
<li>画像入力</li>
<li>音声入力</li>
</ul>
`,body: `体調管理（と会社での感染予防）のために毎朝体温を測るのが習慣化しています。
しかし、朝の1分1秒は非常に貴重な時間です。できればiPhoneでの体温データ入力も極限まで無駄を減らしたいところです。

そこで、体温を最速で入力するためにはどんな入力インターフェースがいいのかを検討してみようと思いました。

HealthKitへの体温データ追加については前回調査しました

[Swift: HealthKitに体温データを入力する。できるだけ公式ドキュメントだけを見て。](https://qiita.com/sYamaz/items/cedfd869f74f14b4b25b)

# 開発環境

* Xcode 13
* swift 5
* 対象プラットフォーム:iOS 14以上（主にiphone）

# 条件

* 主なユーザー：私
    * 体温の単位は摂氏です
    * 平熱は36℃台中盤で、35℃台になることはありません
    * 40℃台になったことはありません。

# タップ数ベースの参考記録

新規入力時

1. ヘルスケアアプリ起動（1タップ）
1. お気に入り登録してある「体温」の項目をタップ（1タップ）
1. 「データを追加」をタップ（1タップ）
1. iOSのソフトウェアキーボードで体温を入力（4タップ:"36.5"など）
1. 「追加」をタップ（1タップ）

合計8タップ



# ユーザーインターフェースの検討

※そもそも体温を測ったらiPhoneと接続して勝手に記録してくれる体温計があればいい話ですがそれは置いておきます。

どんな入力方法があるか考えてみます（実現方法は置いておきます）

## 画像入力

以下の２方法を思いつきました

* 計測後の体温計にカメラをかざして体温の文字列を読み込む方式
* 計測後の体温計の写真を撮って解析する方式

今後Try予定です

## 音声入力

「Hey Siri！ 今日の体温は36.7度だったよ！」と言う方式です

今後Try予定です

## タッチ入力

ソフトウェアキーボードをはじめとしたタッチ操作で入力する方式です。

とはいえソフトウェアキーボードを使用したアプリだと上記参考記録とタップ数は大差なくなってしまうので別の方法を考えてみます。

### ソフトウェアキーボードじゃダメなの？

※1秒を惜しむ人間の思考です

* 仮に体温が「36.5度」だったとして、「3」と「.」は入力しなくて良のではないでしょうか？大抵変わるのは「6」と「5」の部分です。冒頭で示したように40度行くことはほぼないです。
* 修正するときにBackSpace入力するのがめんどくさいという思いもあります

これらに対して、「小数点以上」「小数点以下」それぞれで上書きで入力することができればいいのでは？と思い作成したプロトタイプが以下になります。

![タイトルなし.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/88282c02-a58d-cef4-2a28-33411eafed30.gif)

理想的には

* アプリ起動（1タップ）
* 小数点以上の桁入力（1タップ。平熱の場合タップ無しになることも）
* 小数点以下の桁入力（1タップ）
* 登録ボタン（1タップ）

合計4タップ

小数点以上、以下それぞれ独立して数値を上書きしていくため、入力後の修正もBackSpace不要です

# repository

https://github.com/sYamaz/BodyTempLogger

# 結果

今回は使用者を限定することで理論上ではタップ数が半減するインターフェースとなりました。

次回以降試してみたいことの一覧です

* タッチ入力
    * スワイプなどの操作も活用できないか
* 画像入力
* 音声入力


`,coediting: false,comments_count: 0,created_at: '2021-10-17T22:22:01+09:00',group: '{ }',id: '9ef8fceb5650fc7b7ad8',likes_count: 1,private: false,reactions_count: 0,tags: [{name: 'UI',versions: [  ]},{name: 'Swift',versions: [  ]},{name: 'HealthKit',versions: [  ]},{name: 'ユーザーインターフェース',versions: [  ]},{name: 'SwiftUI',versions: [  ]}],title: '体温を最速で入力するためのユーザーインターフェースの検討（その1）',updated_at: '2021-10-28T22:25:02+09:00',url: 'https://qiita.com/sYamaz/items/9ef8fceb5650fc7b7ad8',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>まずは公式ドキュメントをちゃんと読む人間になろうと思いたち、Apple公式ドキュメント<strong>だけ</strong>を元にHealthKitにアクセスを試みました。</p>

<h1>
<span id="環境" class="fragment"></span><a href="#%E7%92%B0%E5%A2%83"><i class="fa fa-link"></i></a>環境</h1>

<ul>
<li>XCode Version 13.0</li>
<li>iOS target 14.0</li>
</ul>

<h1>
<span id="参考公式" class="fragment"></span><a href="#%E5%8F%82%E8%80%83%E5%85%AC%E5%BC%8F"><i class="fa fa-link"></i></a>参考(公式）</h1>

<ul>
<li>前説

<ul>
<li><a href="https://developer.apple.com/documentation/healthkit/about_the_healthkit_framework" class="autolink" rel="nofollow noopener" target="_blank">https://developer.apple.com/documentation/healthkit/about_the_healthkit_framework</a></li>
</ul>
</li>
<li>XCodeでHealthKitを有効化する

<ul>
<li><a href="https://developer.apple.com/documentation/healthkit/setting_up_healthkit" class="autolink" rel="nofollow noopener" target="_blank">https://developer.apple.com/documentation/healthkit/setting_up_healthkit</a></li>
</ul>
</li>
<li>プライバシーデータへアクセスするためのプロジェクト設定

<ul>
<li><a href="https://developer.apple.com/documentation/healthkit/protecting_user_privacy" class="autolink" rel="nofollow noopener" target="_blank">https://developer.apple.com/documentation/healthkit/protecting_user_privacy</a></li>
</ul>
</li>
<li>Swiftでヘルスケアデータにアクセス

<ul>
<li><a href="https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data" class="autolink" rel="nofollow noopener" target="_blank">https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data</a></li>
</ul>
</li>
</ul>

<h1>
<span id="プロジェクト設定" class="fragment"></span><a href="#%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E8%A8%AD%E5%AE%9A"><i class="fa fa-link"></i></a>プロジェクト設定</h1>

<p>HealthKitの有効化(プロジェクト設定の「Signing &amp; Capabilities」にHealthKitを追加</p>

<p><a href="https://camo.qiitausercontent.com/0211e77a2ebbe197a44be78d8dfb43e85393efb2/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f30326432346564382d656231302d623030372d613436382d6332643563646531333538342e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F02d24ed8-eb10-b007-a468-c2d5cde13584.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=80641514039fefa756c0148300968c9d" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/02d24ed8-eb10-b007-a468-c2d5cde13584.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F02d24ed8-eb10-b007-a468-c2d5cde13584.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=927ef4f2159ce1e0c1597dcb0f764398 1x" loading="lazy"></a></p>

<p>アクセス要求用のメッセージ定義</p>

<p><a href="https://camo.qiitausercontent.com/11b9b19ef7f705c173251b9411ecf9e76317e500/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f34363565656534612d386131332d333737382d626438362d6666623031313765353964332e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F465eee4a-8a13-3778-bd86-ffb0117e59d3.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=d586d3d2365acd96b247f3d69701692c" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/465eee4a-8a13-3778-bd86-ffb0117e59d3.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F465eee4a-8a13-3778-bd86-ffb0117e59d3.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=1b2ffc03a0086e24631bbce1266c41de 1x" loading="lazy"></a></p>

<p>今回は体温データの入力のみなので<code>Privacy - Health Update Usage Description</code><br>
アプリが読み出しする場合は<code>Privacy - Health Share Usage Description</code>が必要になります</p>

<p>参考: <a href="https://developer.apple.com/documentation/healthkit/protecting_user_privacy" rel="nofollow noopener" target="_blank">Protecting User Privacy (developer.apple.com)</a></p>

<div class="note info">
<span class="fa fa-fw fa-check-circle"></span><p>これらのDescriptionは１３文字以上必要なようです。これに関しては調査力が足りず、StackOverflowのお世話になりました。

https://stackoverflow.com/questions/37863093/exception-nsinvalidargumentexception-nshealthupdateusagedescritption
</p>
</div>

<h1>
<span id="コード" class="fragment"></span><a href="#%E3%82%B3%E3%83%BC%E3%83%89"><i class="fa fa-link"></i></a>コード</h1>

<p>今回は1つのクラス内でHealthKitへの参照を完結させます</p>

<h2>
<span id="setup" class="fragment"></span><a href="#setup"><i class="fa fa-link"></i></a>setup()</h2>

<p><code>HKHealthStore</code>はドキュメントによれば、無闇に生成せず保持し続けるのがいいようです。</p>

<blockquote>
<p>You need only a single HealthKit store per app. These are long-lived objects; you create the store once, and keep a reference for later use.</p>

<p><a href="https://developer.apple.com/documentation/healthkit/setting_up_healthkit" rel="nofollow noopener" target="_blank">Setting Up HealthKit (developer.apple.com)</a></p>
</blockquote>

<p>エラーチェックで呼び出し側の処理を変えることなども考慮し、setup()メソッドでStoreの生成を行います。（エラーチェックが不要であればinit()内で生成してました）</p>

<h2>
<span id="postbodytemperature" class="fragment"></span><a href="#postbodytemperature"><i class="fa fa-link"></i></a>postBodyTemperature()</h2>

<p>以下の順番で処理を行います</p>

<ul>
<li>体温データに関するアクセス許可取得</li>
<li>アクセス許可状態の確認</li>
<li>体温データの保存</li>
</ul>

<h2>
<span id="出来上がったclass" class="fragment"></span><a href="#%E5%87%BA%E6%9D%A5%E4%B8%8A%E3%81%8C%E3%81%A3%E3%81%9Fclass"><i class="fa fa-link"></i></a>出来上がったClass</h2>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">Foundation</span>
<span class="kd">import</span> <span class="kt">HealthKit</span>

<span class="kd">enum</span> <span class="kt">BodyTemperatureUnit</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="c1">/// 摂氏</span>
    <span class="k">case</span> <span class="n">degreeCelsius</span>
    <span class="c1">/// 華氏</span>
    <span class="k">case</span> <span class="n">degreeFahrenheit</span>
<span class="p">${"$"}{"}"}</span>
<span class="kd">class</span> <span class="kt">HealthCareRepository</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">let</span> <span class="nv">allTypes</span> <span class="o">=</span> <span class="kt">Set</span><span class="p">([</span><span class="kt">HKObjectType</span><span class="o">.</span><span class="nf">quantityType</span><span class="p">(</span><span class="nv">forIdentifier</span><span class="p">:</span> <span class="o">.</span><span class="n">bodyTemperature</span><span class="p">)</span><span class="o">!</span><span class="p">])</span>
    <span class="c1">/// HKHealthStoreはアプリケーションあたり1インスタンス。１回生成したらそれを使い続ける必要あり</span>
    <span class="k">var</span> <span class="nv">store</span><span class="p">:</span><span class="kt">HKHealthStore</span><span class="p">?</span> <span class="o">=</span> <span class="kc">nil</span>

    <span class="kd">func</span> <span class="nf">setup</span><span class="p">()</span> <span class="o">-&gt;</span> <span class="kt">Bool</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="c1">/// ipadではヘルスケア使えない</span>
        <span class="c1">/// https://developer.apple.com/documentation/healthkit/setting_up_healthkit</span>
        <span class="c1">/// Ensure HealthKit’s Availability</span>
        <span class="k">if</span> <span class="p">(</span><span class="kt">HKHealthStore</span><span class="o">.</span><span class="nf">isHealthDataAvailable</span><span class="p">()</span> <span class="o">==</span> <span class="kc">false</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
            <span class="c1">// ヘルスデータが無効状態</span>
            <span class="k">return</span> <span class="kc">false</span>
        <span class="p">${"$"}{"}"}</span>

        <span class="c1">/// ヘルスケア機能があり、有効である場合生成する</span>
        <span class="k">self</span><span class="o">.</span><span class="n">store</span> <span class="o">=</span> <span class="kt">HKHealthStore</span><span class="p">()</span>
        <span class="k">return</span> <span class="kc">true</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">func</span> <span class="nf">postBodyTemperature</span><span class="p">(</span><span class="n">_</span> <span class="nv">value</span><span class="p">:</span><span class="kt">Double</span><span class="p">,</span> <span class="nv">unit</span><span class="p">:</span><span class="kt">BodyTemperatureUnit</span><span class="p">,</span> <span class="nv">completion</span><span class="p">:</span><span class="kd">@escaping</span> <span class="p">(</span><span class="kt">Bool</span><span class="p">,</span> <span class="kt">Error</span><span class="p">?)</span> <span class="o">-&gt;</span> <span class="kt">Void</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">Void</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>

        <span class="c1">/// https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data</span>
        <span class="c1">/// Request Permission from the User</span>
        <span class="c1">/// toShare: Write要求</span>
        <span class="c1">/// read: Read要求</span>
        <span class="k">self</span><span class="o">.</span><span class="n">store</span><span class="o">!.</span><span class="nf">requestAuthorization</span><span class="p">(</span><span class="nv">toShare</span><span class="p">:</span> <span class="n">allTypes</span><span class="p">,</span> <span class="nv">read</span><span class="p">:</span> <span class="kc">nil</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span> <span class="p">(</span><span class="n">success</span><span class="p">,</span> <span class="n">error</span><span class="p">)</span> <span class="k">in</span>
            <span class="k">if</span> <span class="o">!</span><span class="n">success</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                <span class="nf">completion</span><span class="p">(</span><span class="n">success</span><span class="p">,</span> <span class="n">error</span><span class="p">)</span>
                <span class="k">return</span>
            <span class="p">${"$"}{"}"}</span>

            <span class="c1">/// https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data</span>
            <span class="c1">/// Check for Authorization Before Saving Data</span>
            <span class="k">let</span> <span class="nv">status</span> <span class="o">=</span> <span class="k">self</span><span class="o">.</span><span class="n">store</span><span class="o">!.</span><span class="nf">authorizationStatus</span><span class="p">(</span><span class="nv">for</span><span class="p">:</span> <span class="o">.</span><span class="nf">quantityType</span><span class="p">(</span><span class="nv">forIdentifier</span><span class="p">:</span> <span class="o">.</span><span class="n">bodyTemperature</span><span class="p">)</span><span class="o">!</span><span class="p">)</span>
            <span class="k">switch</span> <span class="n">status</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
            <span class="k">case</span> <span class="o">.</span><span class="nv">notDetermined</span><span class="p">:</span>
                <span class="c1">// "If you have not yet requested permission"</span>
                <span class="c1">// ここに入ることはないはず</span>
                <span class="nf">print</span><span class="p">(</span><span class="s">"Not determined"</span><span class="p">)</span>
                <span class="nf">completion</span><span class="p">(</span><span class="kc">false</span><span class="p">,</span> <span class="kt">HKError</span><span class="p">(</span><span class="kt">HKError</span><span class="o">.</span><span class="n">errorAuthorizationNotDetermined</span><span class="p">))</span>
                <span class="k">return</span>
            <span class="k">case</span> <span class="o">.</span><span class="nv">sharingDenied</span><span class="p">:</span><span class="c1">// If the user has denied permission</span>
                <span class="c1">// ユーザーが許可しなかった場合</span>
                <span class="nf">print</span><span class="p">(</span><span class="s">"Sharing Denied"</span><span class="p">)</span>
                <span class="nf">completion</span><span class="p">(</span><span class="kc">false</span><span class="p">,</span> <span class="kt">HKError</span><span class="p">(</span><span class="kt">HKError</span><span class="o">.</span><span class="n">errorAuthorizationDenied</span><span class="p">))</span>
                <span class="k">break</span>
            <span class="k">case</span> <span class="o">.</span><span class="nv">sharingAuthorized</span><span class="p">:</span>
                <span class="c1">// ユーザーが許可した場合</span>
                <span class="nf">print</span><span class="p">(</span><span class="s">"Sharing Authorized"</span><span class="p">)</span>
                <span class="k">break</span>
            <span class="kd">@unknown</span> <span class="k">default</span><span class="p">:</span>
                <span class="nf">print</span><span class="p">(</span><span class="s">"Unknown status."</span><span class="p">)</span>
                <span class="k">break</span>
            <span class="p">${"$"}{"}"}</span>

            <span class="c1">// Datetime</span>
            <span class="k">let</span> <span class="nv">now</span> <span class="o">=</span> <span class="kt">Date</span><span class="p">()</span>
            <span class="c1">// 摂氏 or 華氏</span>
            <span class="k">let</span> <span class="nv">hkUnit</span><span class="p">:</span><span class="kt">HKUnit</span>
            <span class="k">switch</span> <span class="n">unit</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
            <span class="k">case</span> <span class="o">.</span><span class="nv">degreeCelsius</span><span class="p">:</span>
                <span class="n">hkUnit</span> <span class="o">=</span> <span class="o">.</span><span class="nf">degreeCelsius</span><span class="p">()</span>
            <span class="k">case</span> <span class="o">.</span><span class="nv">degreeFahrenheit</span><span class="p">:</span>
                <span class="n">hkUnit</span> <span class="o">=</span> <span class="o">.</span><span class="nf">degreeFahrenheit</span><span class="p">()</span>
            <span class="p">${"$"}{"}"}</span>

            <span class="k">let</span> <span class="nv">quantity</span> <span class="o">=</span> <span class="kt">HKQuantity</span><span class="p">(</span><span class="nv">unit</span><span class="p">:</span> <span class="n">hkUnit</span><span class="p">,</span> <span class="nv">doubleValue</span><span class="p">:</span> <span class="n">value</span><span class="p">)</span>
            <span class="k">let</span> <span class="nv">obj</span> <span class="o">=</span> <span class="kt">HKQuantitySample</span><span class="p">(</span><span class="nv">type</span><span class="p">:</span> <span class="o">.</span><span class="nf">quantityType</span><span class="p">(</span><span class="nv">forIdentifier</span><span class="p">:</span> <span class="o">.</span><span class="n">bodyTemperature</span><span class="p">)</span><span class="o">!</span><span class="p">,</span> <span class="nv">quantity</span><span class="p">:</span> <span class="n">quantity</span><span class="p">,</span> <span class="nv">start</span><span class="p">:</span> <span class="n">now</span><span class="p">,</span> <span class="nv">end</span><span class="p">:</span> <span class="n">now</span><span class="p">)</span>
            <span class="k">self</span><span class="o">.</span><span class="n">store</span><span class="o">!.</span><span class="nf">save</span><span class="p">(</span><span class="n">obj</span><span class="p">,</span> <span class="nv">withCompletion</span><span class="p">:</span> <span class="n">completion</span><span class="p">)</span>
        <span class="p">${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<h2>
<span id="結果" class="fragment"></span><a href="#%E7%B5%90%E6%9E%9C"><i class="fa fa-link"></i></a>結果</h2>

<p>適当なUI作って上記クラスを試した結果、シミュレータ上ではありますが無事に体温データをヘルスケアに登録することができました。大抵のことは公式Documentに書いてあることも実感できました。次回はUI予定です。</p>

<p><a href="https://camo.qiitausercontent.com/341c61dda64b171dac4e10e84e8312c6e46a8a6c/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f33653464336634612d633035612d633263362d393865632d3531626432316137393234392e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F3e4d3f4a-c05a-c2c6-98ec-51bd21a79249.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=bd4343448314c8824b4a89cd17d773bf" alt="image.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/3e4d3f4a-c05a-c2c6-98ec-51bd21a79249.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2F3e4d3f4a-c05a-c2c6-98ec-51bd21a79249.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=d1e6f96b440cc125043b12b6c156a0f5 1x" loading="lazy"></a></p>
`,body: `まずは公式ドキュメントをちゃんと読む人間になろうと思いたち、Apple公式ドキュメント**だけ**を元にHealthKitにアクセスを試みました。

# 環境

* XCode Version 13.0
* iOS target 14.0

# 参考(公式）

* 前説
    * https://developer.apple.com/documentation/healthkit/about_the_healthkit_framework
* XCodeでHealthKitを有効化する
    * https://developer.apple.com/documentation/healthkit/setting_up_healthkit
* プライバシーデータへアクセスするためのプロジェクト設定
    * https://developer.apple.com/documentation/healthkit/protecting_user_privacy
* Swiftでヘルスケアデータにアクセス
    * https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data

# プロジェクト設定

HealthKitの有効化(プロジェクト設定の「Signing & Capabilities」にHealthKitを追加

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/02d24ed8-eb10-b007-a468-c2d5cde13584.png)


アクセス要求用のメッセージ定義

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/465eee4a-8a13-3778-bd86-ffb0117e59d3.png)


今回は体温データの入力のみなので\`Privacy - Health Update Usage Description\`
アプリが読み出しする場合は\`Privacy - Health Share Usage Description\`が必要になります

参考: [Protecting User Privacy (developer.apple.com)](https://developer.apple.com/documentation/healthkit/protecting_user_privacy)

:::note info
これらのDescriptionは１３文字以上必要なようです。これに関しては調査力が足りず、StackOverflowのお世話になりました。

https://stackoverflow.com/questions/37863093/exception-nsinvalidargumentexception-nshealthupdateusagedescritption
:::

# コード

今回は1つのクラス内でHealthKitへの参照を完結させます


## setup()

\`HKHealthStore\`はドキュメントによれば、無闇に生成せず保持し続けるのがいいようです。

> You need only a single HealthKit store per app. These are long-lived objects; you create the store once, and keep a reference for later use.
>
> [Setting Up HealthKit (developer.apple.com)](https://developer.apple.com/documentation/healthkit/setting_up_healthkit)


エラーチェックで呼び出し側の処理を変えることなども考慮し、setup()メソッドでStoreの生成を行います。（エラーチェックが不要であればinit()内で生成してました）
## postBodyTemperature()

以下の順番で処理を行います

* 体温データに関するアクセス許可取得
* アクセス許可状態の確認
* 体温データの保存

## 出来上がったClass

\`\`\`swift
import Foundation
import HealthKit

enum BodyTemperatureUnit${"$"}{"{"${"$"}{"}"}
    /// 摂氏
    case degreeCelsius
    /// 華氏
    case degreeFahrenheit
${"$"}{"}"}
class HealthCareRepository${"$"}{"{"${"$"}{"}"}
    let allTypes = Set([HKObjectType.quantityType(forIdentifier: .bodyTemperature)!])
    /// HKHealthStoreはアプリケーションあたり1インスタンス。１回生成したらそれを使い続ける必要あり
    var store:HKHealthStore? = nil
    
    func setup() -> Bool${"$"}{"{"${"$"}{"}"}
        /// ipadではヘルスケア使えない
        /// https://developer.apple.com/documentation/healthkit/setting_up_healthkit
        /// Ensure HealthKit’s Availability
        if (HKHealthStore.isHealthDataAvailable() == false)${"$"}{"{"${"$"}{"}"}
            // ヘルスデータが無効状態
            return false
        ${"$"}{"}"}
        
        /// ヘルスケア機能があり、有効である場合生成する
        self.store = HKHealthStore()
        return true
    ${"$"}{"}"}

    func postBodyTemperature(_ value:Double, unit:BodyTemperatureUnit, completion:@escaping (Bool, Error?) -> Void) -> Void${"$"}{"{"${"$"}{"}"}
        
        /// https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data
        /// Request Permission from the User
        /// toShare: Write要求
        /// read: Read要求
        self.store!.requestAuthorization(toShare: allTypes, read: nil)${"$"}{"{"${"$"}{"}"} (success, error) in
            if !success${"$"}{"{"${"$"}{"}"}
                completion(success, error)
                return
            ${"$"}{"}"}
            
            /// https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data
            /// Check for Authorization Before Saving Data
            let status = self.store!.authorizationStatus(for: .quantityType(forIdentifier: .bodyTemperature)!)
            switch status${"$"}{"{"${"$"}{"}"}
            case .notDetermined:
                // "If you have not yet requested permission"
                // ここに入ることはないはず
                print("Not determined")
                completion(false, HKError(HKError.errorAuthorizationNotDetermined))
                return
            case .sharingDenied:// If the user has denied permission
                // ユーザーが許可しなかった場合
                print("Sharing Denied")
                completion(false, HKError(HKError.errorAuthorizationDenied))
                break
            case .sharingAuthorized:
                // ユーザーが許可した場合
                print("Sharing Authorized")
                break
            @unknown default:
                print("Unknown status.")
                break
            ${"$"}{"}"}
            
            // Datetime
            let now = Date()
            // 摂氏 or 華氏
            let hkUnit:HKUnit
            switch unit ${"$"}{"{"${"$"}{"}"}
            case .degreeCelsius:
                hkUnit = .degreeCelsius()
            case .degreeFahrenheit:
                hkUnit = .degreeFahrenheit()
            ${"$"}{"}"}
            
            let quantity = HKQuantity(unit: hkUnit, doubleValue: value)
            let obj = HKQuantitySample(type: .quantityType(forIdentifier: .bodyTemperature)!, quantity: quantity, start: now, end: now)
            self.store!.save(obj, withCompletion: completion)
        ${"$"}{"}"}
    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`


## 結果

適当なUI作って上記クラスを試した結果、シミュレータ上ではありますが無事に体温データをヘルスケアに登録することができました。大抵のことは公式Documentに書いてあることも実感できました。次回はUI予定です。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/3e4d3f4a-c05a-c2c6-98ec-51bd21a79249.png)
`,coediting: false,comments_count: 1,created_at: '2021-10-14T22:26:17+09:00',group: '{ }',id: 'cedfd869f74f14b4b25b',likes_count: 0,private: false,reactions_count: 0,tags: [{name: 'Swift',versions: [  ]},{name: 'HealthKit',versions: [  ]}],title: 'Swift: HealthKitに体温データを入力する。できるだけ公式ドキュメントだけを見て。',updated_at: '2021-12-30T15:59:37+09:00',url: 'https://qiita.com/sYamaz/items/cedfd869f74f14b4b25b',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>前回、<a href="https://qiita.com/sYamaz/items/1a29a2cb5b3207ad87dc" id="reference-b37a8931e3901955ed10">SwiftでMarkdownを解析してオブジェクトツリーに変換する</a>という記事を作成しましたが、今回はその続きです。</p>

<p>尚、前回記事で「レンダリングはしてくれるけどオブジェクトツリーにしてくれるパッケージあまりないな...」と言いましたが大抵のSwiftのMarkdownレンダリング系パッケージは</p>

<p><code>text</code>--&gt;<code>node tree</code>--&gt;<code>html</code></p>

<p>のような変換過程を辿っていることがわかりました。つまり今Tryしていることはいわゆる「車輪の再発明」ということです。勉強になるからいいかと割り切ってます</p>

<h1>
<span id="問題点" class="fragment"></span><a href="#%E5%95%8F%E9%A1%8C%E7%82%B9"><i class="fa fa-link"></i></a>問題点</h1>

<p>「とりあえず動くもの！」ということで前回はとりあえずif分岐をひたすらしていましたが流石にテストし難いです。</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="c1">/// 以下はイメージです</span>
<span class="kd">func</span> <span class="nf">parse</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
  <span class="k">while</span><span class="p">(</span><span class="n">全文字探査するまで</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">if</span><span class="p">(</span><span class="kt">H1の場合</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span>
    <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="kt">H2の場合</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span>
    <span class="c1">// 中略。無限にelse if...</span>
    <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="nf">コードブロック</span><span class="p">(</span><span class="s">"\`\`\`"</span><span class="p">)</span><span class="n">の場合</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="mi">1</span><span class="n">文字進める</span><span class="err">、</span><span class="nf">または処理済みの所まで進める</span><span class="p">()</span>
  <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>

</code></pre></div></div>

<h1>
<span id="変更" class="fragment"></span><a href="#%E5%A4%89%E6%9B%B4"><i class="fa fa-link"></i></a>変更</h1>

<p>Markdownの要素（<code># H1</code>や<code>**strong**</code>,...)ごとにシンプルなテストができるようにしたいです</p>

<h3>
<span id="markdown要素ごとの解析処理の分化" class="fragment"></span><a href="#markdown%E8%A6%81%E7%B4%A0%E3%81%94%E3%81%A8%E3%81%AE%E8%A7%A3%E6%9E%90%E5%87%A6%E7%90%86%E3%81%AE%E5%88%86%E5%8C%96"><i class="fa fa-link"></i></a>Markdown要素ごとの解析処理の分化</h3>

<p><a href="https://qiita.com/sYamaz/items/1a29a2cb5b3207ad87dc">前回記事</a>で述べているように、この開発中のパッケージではMarkdownの各種要素をそれぞれインライン要素、ブロック要素とみなしています。それぞれの要素ごとにParserを作成するイメージでクラス分離していってます。</p>

<p>（紫で塗りつぶされているのは<code>protocol</code>)</p>

<p><a href="https://camo.qiitausercontent.com/35d3e18b9cd266404ce99a3b813a9c393d93a965/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f323038383339392f66353931383463382d613436322d316337322d313666622d3435653837626638616333392e706e67" target="_blank" rel="nofollow noopener"><img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2Ff59184c8-a462-1c72-16fb-45e87bf8ac39.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;s=8f853ab3c291b326b886075ecc064d09" alt="Untitled Diagram.drawio.png" data-canonical-src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/f59184c8-a462-1c72-16fb-45e87bf8ac39.png" srcset="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2088399%2Ff59184c8-a462-1c72-16fb-45e87bf8ac39.png?ixlib=rb-4.0.0&amp;auto=format&amp;gif-q=60&amp;q=75&amp;w=1400&amp;fit=max&amp;s=38ea9016a1831ce46629de5c0efecf8f 1x" loading="lazy"></a></p>

<p><code>BlockParserDelegate</code>も<code>InlineParserDelegate</code>もそれぞれ、解析結果のオブジェクトと、まだ解析していないMarkdown文字列を返します。</p>

<h4>
<span id="blockparserdelegate" class="fragment"></span><a href="#blockparserdelegate"><i class="fa fa-link"></i></a>BlockParserDelegate</h4>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">Foundation</span>
<span class="kd">public</span> <span class="kd">protocol</span> <span class="kt">BlockParserDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">func</span> <span class="nf">parse</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="p">,</span> <span class="nv">closure</span><span class="p">:(</span><span class="kt">String</span><span class="p">)</span><span class="o">-&gt;</span><span class="p">[</span><span class="kt">MDInline</span><span class="p">])</span> <span class="o">-&gt;</span> <span class="p">(</span><span class="nv">nextText</span><span class="p">:</span><span class="kt">String</span><span class="p">,</span> <span class="nv">node</span><span class="p">:</span><span class="kt">MDBlock</span><span class="p">?);</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<h4>
<span id="inlineparserdelegate" class="fragment"></span><a href="#inlineparserdelegate"><i class="fa fa-link"></i></a>InlineParserDelegate</h4>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">Foundation</span>
<span class="kd">public</span> <span class="kd">protocol</span> <span class="kt">InlineParserDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">func</span> <span class="nf">parse</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="p">(</span><span class="nv">nextText</span><span class="p">:</span><span class="kt">String</span><span class="p">,</span> <span class="nv">node</span><span class="p">:</span><span class="kt">MDInline</span><span class="p">?)</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<p>このProtocolの実装クラス<code>StrongParser</code></p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">Foundation</span>
<span class="kd">public</span> <span class="kd">class</span> <span class="kt">StrongParser</span><span class="p">:</span> <span class="kt">InlineParserDelegate</span>
<span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">public</span> <span class="kd">func</span> <span class="nf">parse</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="p">(</span><span class="nv">nextText</span><span class="p">:</span><span class="kt">String</span><span class="p">,</span> <span class="nv">node</span><span class="p">:</span><span class="kt">MDInline</span><span class="p">?)${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"**"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
            <span class="c1">// scan</span>
            <span class="k">let</span> <span class="nv">subStartIndex</span> <span class="o">=</span> <span class="n">text</span><span class="o">.</span><span class="nf">index</span><span class="p">(</span><span class="n">text</span><span class="o">.</span><span class="n">startIndex</span><span class="p">,</span> <span class="nv">offsetBy</span><span class="p">:</span> <span class="mi">2</span><span class="p">)</span>
            <span class="k">let</span> <span class="nv">subText</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">subStartIndex</span><span class="o">...</span><span class="p">]</span>
            <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">subText</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"**"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                <span class="c1">// text between ** and **</span>
                <span class="k">let</span> <span class="nv">content</span> <span class="o">=</span> <span class="n">subText</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]</span>

                <span class="nf">return</span> <span class="p">(</span><span class="kt">String</span><span class="p">(</span><span class="n">subText</span><span class="p">[</span><span class="n">end</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]),</span> <span class="kt">MDStrong</span><span class="p">(</span><span class="kt">String</span><span class="p">(</span><span class="n">content</span><span class="p">)))</span>
            <span class="p">${"$"}{"}"}</span>
        <span class="p">${"$"}{"}"}</span>

        <span class="nf">return</span> <span class="p">(</span><span class="n">text</span><span class="p">,</span> <span class="kc">nil</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>

<p><code>StrongParser</code>では以下のようなイメージです</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="k">let</span> <span class="nv">parser</span> <span class="o">=</span> <span class="kt">StrongParser</span><span class="p">();</span>

<span class="k">let</span> <span class="nv">result1</span> <span class="o">=</span> <span class="n">parser</span><span class="o">.</span><span class="nf">parse</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span> <span class="s">"**bold**text"</span><span class="p">)</span>

<span class="c1">// result1.nextText -&gt; "text"</span>
<span class="c1">// result1.node -&gt; MDStrong(text:"bold")</span>

<span class="k">let</span> <span class="nv">result2</span> <span class="o">=</span> <span class="n">parser</span><span class="o">.</span><span class="nf">parse</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span> <span class="s">"texttext"</span><span class="p">)</span>

<span class="c1">// result2.nextText -&gt; "texttext"</span>
<span class="c1">// result2.node -&gt; nil</span>

</code></pre></div></div>

<h1>
<span id="結果" class="fragment"></span><a href="#%E7%B5%90%E6%9E%9C"><i class="fa fa-link"></i></a>結果</h1>

<p>この変更によってMarkdown要素ごとのテストが可能になりました。あとは呼び出し側のクラスがテスト済みのそれらをうまく使うだけです。</p>

<hr>

<p>今回の記事の内容を適用したまだまだ改善の余地が大きいMarkdown解析Githubリポジトリ</p>

<p><qiita-embed-ogp src="https://github.com/sYamaz/MarkdownAnalyzer"></qiita-embed-ogp></p>
`,body: `前回、[SwiftでMarkdownを解析してオブジェクトツリーに変換する](https://qiita.com/sYamaz/items/1a29a2cb5b3207ad87dc)という記事を作成しましたが、今回はその続きです。

尚、前回記事で「レンダリングはしてくれるけどオブジェクトツリーにしてくれるパッケージあまりないな...」と言いましたが大抵のSwiftのMarkdownレンダリング系パッケージは

\`text\`-->\`node tree\`-->\`html\`

のような変換過程を辿っていることがわかりました。つまり今Tryしていることはいわゆる「車輪の再発明」ということです。勉強になるからいいかと割り切ってます

# 問題点

「とりあえず動くもの！」ということで前回はとりあえずif分岐をひたすらしていましたが流石にテストし難いです。

\`\`\`swift
/// 以下はイメージです
func parse(text:String)${"$"}{"{"${"$"}{"}"}
  while(全文字探査するまで)${"$"}{"{"${"$"}{"}"}
    if(H1の場合)${"$"}{"{"${"$"}{"}"}
    ${"$"}{"}"}
    else if(H2の場合)${"$"}{"{"${"$"}{"}"}
    ${"$"}{"}"}
    // 中略。無限にelse if...
    else if(コードブロック("\`\`\`")の場合)${"$"}{"{"${"$"}{"}"}
    ${"$"}{"}"}

    1文字進める、または処理済みの所まで進める()
  ${"$"}{"}"}
${"$"}{"}"}

\`\`\`

# 変更

Markdownの要素（\`# H1\`や\`**strong**\`,...)ごとにシンプルなテストができるようにしたいです

### Markdown要素ごとの解析処理の分化

[前回記事](https://qiita.com/sYamaz/items/1a29a2cb5b3207ad87dc)で述べているように、この開発中のパッケージではMarkdownの各種要素をそれぞれインライン要素、ブロック要素とみなしています。それぞれの要素ごとにParserを作成するイメージでクラス分離していってます。

（紫で塗りつぶされているのは\`protocol\`)


![Untitled Diagram.drawio.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/f59184c8-a462-1c72-16fb-45e87bf8ac39.png)

\`BlockParserDelegate\`も\`InlineParserDelegate\`もそれぞれ、解析結果のオブジェクトと、まだ解析していないMarkdown文字列を返します。

#### BlockParserDelegate

\`\`\`swift
import Foundation
public protocol BlockParserDelegate${"$"}{"{"${"$"}{"}"}
    func parse(_ text:String, closure:(String)->[MDInline]) -> (nextText:String, node:MDBlock?);
${"$"}{"}"}
\`\`\`

#### InlineParserDelegate

\`\`\`swift
import Foundation
public protocol InlineParserDelegate${"$"}{"{"${"$"}{"}"}
    func parse(text:String) -> (nextText:String, node:MDInline?)
${"$"}{"}"}
\`\`\`

このProtocolの実装クラス\`StrongParser\`

\`\`\`swift
import Foundation
public class StrongParser: InlineParserDelegate
${"$"}{"{"${"$"}{"}"}
    public func parse(text:String) -> (nextText:String, node:MDInline?)${"$"}{"{"${"$"}{"}"}
        if(text.starts(with: "**"))${"$"}{"{"${"$"}{"}"}
            // scan
            let subStartIndex = text.index(text.startIndex, offsetBy: 2)
            let subText = text[subStartIndex...]
            if let end = subText.range(of: "**")${"$"}{"{"${"$"}{"}"}
                // text between ** and **
                let content = subText[..<end.lowerBound]
                
                return (String(subText[end.upperBound...]), MDStrong(String(content)))
            ${"$"}{"}"}
        ${"$"}{"}"}
        
        return (text, nil)
    ${"$"}{"}"}
${"$"}{"}"}
\`\`\`

\`StrongParser\`では以下のようなイメージです

\`\`\`swift
let parser = StrongParser();

let result1 = parser.parse(text: "**bold**text")

// result1.nextText -> "text"
// result1.node -> MDStrong(text:"bold")

let result2 = parser.parse(text: "texttext")

// result2.nextText -> "texttext"
// result2.node -> nil

\`\`\`

# 結果

この変更によってMarkdown要素ごとのテストが可能になりました。あとは呼び出し側のクラスがテスト済みのそれらをうまく使うだけです。

---

今回の記事の内容を適用したまだまだ改善の余地が大きいMarkdown解析Githubリポジトリ

https://github.com/sYamaz/MarkdownAnalyzer

`,coediting: false,comments_count: 0,created_at: '2021-10-03T22:30:32+09:00',group: '{ }',id: '31ef5374ad7c9a0dfde4',likes_count: 0,private: false,reactions_count: 0,tags: [{name: 'test',versions: [  ]},{name: 'Markdown',versions: [  ]},{name: '構文解析',versions: [  ]},{name: 'Swift',versions: [  ]}],title: 'Swift：開発中のMarkdown解析パッケージをもう少しテストしやすくする',updated_at: '2021-10-03T22:30:32+09:00',url: 'https://qiita.com/sYamaz/items/31ef5374ad7c9a0dfde4',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }},{rendered_body: `<p>Markdownをレンダリングしてくれるパッケージはあるけど、オブジェクトツリーにしてくれるものは無いなと思ったのでやってみてます。</p>

<p>オブジェクトツリーに変換できるとコードからMarkdownを扱いやすくなるんじゃないかと思ってます。</p>

<p>続きはこちら:<a href="https://qiita.com/sYamaz/items/31ef5374ad7c9a0dfde4" id="reference-20c42c7a0088ab39fd2d">Swift：開発中のMarkdown解析パッケージをもう少しテストしやすくする</a></p>

<h1>
<span id="環境" class="fragment"></span><a href="#%E7%92%B0%E5%A2%83"><i class="fa fa-link"></i></a>環境</h1>

<ul>
<li>Xcode 13</li>
</ul>

<h1>
<span id="tryした解析の考え方" class="fragment"></span><a href="#try%E3%81%97%E3%81%9F%E8%A7%A3%E6%9E%90%E3%81%AE%E8%80%83%E3%81%88%E6%96%B9"><i class="fa fa-link"></i></a>Tryした解析の考え方</h1>

<p>Markdownの記法は以下の2つに分類できると考えました</p>

<ul>
<li>
<code># h1</code>やリスト、引用文などの１行〜複数行の役割が決まる定義</li>
<li>
<code>**bold**</code>や<code>[name](link)</code>などの１行の中で繰り返し使用できる定義</li>
</ul>

<p>仮にこの記事では前者をブロック要素、後者をインライン要素と名付けると、ブロック要素の中にはインライン要素が含まれる可能性がありますが、逆のパターンは存在しません。（命名が意味不明だったらすみません）</p>

<p>したがって、以下のサンプルMarkdownの構造をツリーとして表現すると次のような形になると考えます</p>

<h5>
<span id="サンプルmarkdown" class="fragment"></span><a href="#%E3%82%B5%E3%83%B3%E3%83%97%E3%83%ABmarkdown"><i class="fa fa-link"></i></a>サンプルMarkdown</h5>

<div class="code-frame" data-lang="markdown"><div class="highlight"><pre><code>
<span class="gh"># Tryした解析の考え方</span>

Markdownの記法は以下の２つに分類できると考えました
<span class="p">
*</span> <span class="sb">\`# h1\`</span>やリスト、引用文などの１行〜複数行の役割が決まる定義
<span class="p">*</span> <span class="sb">\`**bold**\`</span>や<span class="sb">\`[name](link)\`</span>などの１行の中で繰り返し使用できる定義

仮にこの記事では前者をブロック要素、後者をインライン要素と名付けると、ブロック要素の中にはインライン要素が含まれる可能性がありますが、逆のパターンは存在しません。

</code></pre></div></div>

<h5>
<span id="ツリー" class="fragment"></span><a href="#%E3%83%84%E3%83%AA%E3%83%BC"><i class="fa fa-link"></i></a>ツリー</h5>

<ul>
<li>
<p>Markdownツリー</p>

<ul>
<li>ブロック要素 h1要素

<ul>
<li>インライン要素 テキスト「<code>Tryした解析の考え方</code>」</li>
</ul>
</li>
<li>ブロック要素 段落要素

<ul>
<li>インライン要素 テキスト「<code>Markdownの記法は以下の２つに分類できると考えました</code>」</li>
</ul>
</li>
<li>ブロック要素 リスト要素

<ul>
<li>ブロック要素 リスト項目要素

<ul>
<li>インライン要素 コード「<code># h1</code>」</li>
<li>インライン要素 テキスト「<code>や、リスト、引用文などの1行〜複数行の役割が決まる定義</code>」</li>
</ul>
</li>
<li>ブロック要素 リスト項目要素

<ul>
<li>インライン要素 太字「<code>bold</code>」</li>
<li>インライン要素 テキスト「<code>や</code>」</li>
<li>インライン要素 リンク「<code>[name](link)</code>」</li>
<li>インライン要素 テキスト「<code>などの１行の中で繰り返し使用できる定義</code>」</li>
</ul>
</li>
</ul>
</li>
<li>ブロック要素 段落要素

<ul>
<li>インライン要素 テキスト「<code>仮にこの記事では前者をブロック要素、後者をインライン要素と名付けると、ブロック要素の中にはインライン要素が含まれる可能性がありますが、逆のパターンは存在しません。</code>」</li>
</ul>
</li>
</ul>
</li>
</ul>

<h1>
<span id="結果" class="fragment"></span><a href="#%E7%B5%90%E6%9E%9C"><i class="fa fa-link"></i></a>結果</h1>

<p>Swiftでこれらを表現した結果（一部不十分な実装あり）をGithubのリポジトリに作成しました。今後、バグ修正しつつPackageとして使えるようにしていこうと思ってます。</p>

<p><qiita-embed-ogp src="https://github.com/sYamaz/MarkdownAnalyzer"></qiita-embed-ogp></p>

<p>2021.9.26時点のコード。</p>

<div class="code-frame" data-lang="swift"><div class="highlight"><pre><code><span class="kd">import</span> <span class="kt">Foundation</span>
<span class="kd">import</span> <span class="kt">SwiftUI</span>

<span class="kd">protocol</span> <span class="kt">MDNodeDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}${"$"}{"}"}</span>

<span class="kd">protocol</span> <span class="kt">MDBlockDelegate</span> <span class="p">:</span> <span class="kt">MDNodeDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}${"$"}{"}"}</span>

<span class="kd">protocol</span> <span class="kt">MDInlineDelegate</span> <span class="p">:</span> <span class="kt">MDNodeDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}${"$"}{"}"}</span>

<span class="kd">public</span> <span class="kd">class</span> <span class="kt">MarkdownAnalyzer</span>
<span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="kd">func</span> <span class="nf">parse</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span> <span class="kt">String</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDSyntaxTree</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">blocks</span> <span class="o">=</span> <span class="p">[</span><span class="kt">MDBlockDelegate</span><span class="p">]()</span>
        <span class="c1">// blockに分割する</span>
        <span class="k">var</span> <span class="nv">ind</span> <span class="o">=</span> <span class="n">text</span><span class="o">.</span><span class="n">startIndex</span>
        <span class="k">while</span><span class="p">(</span><span class="n">ind</span> <span class="o">!=</span> <span class="n">text</span><span class="o">.</span><span class="n">endIndex</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
            <span class="k">var</span> <span class="nv">nextInd</span> <span class="o">=</span> <span class="n">text</span><span class="o">.</span><span class="nf">index</span><span class="p">(</span><span class="nv">after</span><span class="p">:</span> <span class="n">ind</span><span class="p">)</span>
            <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"# "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline1</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span> <span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline1</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"## "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline2</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span> <span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline2</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"### "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline3</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline3</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"#### "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline4</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline4</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"##### "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline5</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline5</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"###### "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline6</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHeadline6</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"---</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"---</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHorizontalRule</span><span class="p">(</span><span class="s">"---</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"===</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"===</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseHorizontalRule</span><span class="p">(</span><span class="s">"===</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"\`\`\`"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">start</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"\`\`\`"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">start</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"\`\`\`</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>

                        <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseCodeBlock</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">upperBound</span><span class="p">]))</span>
                        <span class="n">nextInd</span> <span class="o">=</span> <span class="n">end</span><span class="o">.</span><span class="n">upperBound</span>
                    <span class="p">${"$"}{"}"}</span>
                    <span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                        <span class="k">break</span><span class="p">;</span>
                    <span class="p">${"$"}{"}"}</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"- "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseUnorderedList</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseUnorderedList</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"* "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseUnorderedList</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseUnorderedList</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"+ "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseUnorderedList</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseUnorderedList</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"1. "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseOrderedList</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseOrderedList</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"&gt; "</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseBlockQuote</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseBlockQuote</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"|"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="c1">//table or paragragh</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"|</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>

                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseTable</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseParagragh</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span> <span class="c1">// paragragh</span>
                <span class="k">let</span> <span class="nv">blockSpan</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">r</span> <span class="o">=</span> <span class="n">blockSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseParagragh</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">r</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                    <span class="n">nextInd</span> <span class="o">=</span> <span class="n">r</span><span class="o">.</span><span class="n">upperBound</span>
                <span class="p">${"$"}{"}"}</span><span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                    <span class="n">blocks</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseParagragh</span><span class="p">(</span><span class="n">blockSpan</span><span class="p">))</span>
                    <span class="k">break</span><span class="p">;</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>

            <span class="n">ind</span> <span class="o">=</span> <span class="n">nextInd</span>
        <span class="p">${"$"}{"}"}</span>

        <span class="k">let</span> <span class="nv">ret</span> <span class="o">=</span> <span class="kt">MDSyntaxTree</span><span class="p">(</span><span class="nv">blocks</span><span class="p">:</span> <span class="n">blocks</span><span class="p">)</span>
        <span class="k">return</span> <span class="n">ret</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseHeadline1</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">data</span> <span class="o">=</span> <span class="n">text</span>
        <span class="n">data</span><span class="o">.</span><span class="nf">removeFirst</span><span class="p">(</span><span class="mi">1</span><span class="p">)</span>
        <span class="k">let</span> <span class="nv">subString</span> <span class="o">=</span> <span class="n">data</span><span class="o">.</span><span class="nf">trimmingCharacters</span><span class="p">(</span><span class="nv">in</span><span class="p">:</span> <span class="kt">CharacterSet</span><span class="p">(</span><span class="nv">charactersIn</span><span class="p">:</span> <span class="s">" "</span><span class="p">))</span>
        <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">(</span><span class="n">subString</span><span class="p">))</span>
        <span class="k">return</span> <span class="kt">MDHeading1</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseHeadline2</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">data</span> <span class="o">=</span> <span class="n">text</span>
        <span class="n">data</span><span class="o">.</span><span class="nf">removeFirst</span><span class="p">(</span><span class="mi">2</span><span class="p">)</span>
        <span class="k">let</span> <span class="nv">subString</span> <span class="o">=</span> <span class="n">data</span><span class="o">.</span><span class="nf">trimmingCharacters</span><span class="p">(</span><span class="nv">in</span><span class="p">:</span> <span class="kt">CharacterSet</span><span class="p">(</span><span class="nv">charactersIn</span><span class="p">:</span> <span class="s">" "</span><span class="p">))</span>
        <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">(</span><span class="n">subString</span><span class="p">))</span>
        <span class="k">return</span> <span class="kt">MDHeading2</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseHeadline3</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">data</span> <span class="o">=</span> <span class="n">text</span>
        <span class="n">data</span><span class="o">.</span><span class="nf">removeFirst</span><span class="p">(</span><span class="mi">3</span><span class="p">)</span>
        <span class="k">let</span> <span class="nv">subString</span> <span class="o">=</span> <span class="n">data</span><span class="o">.</span><span class="nf">trimmingCharacters</span><span class="p">(</span><span class="nv">in</span><span class="p">:</span> <span class="kt">CharacterSet</span><span class="p">(</span><span class="nv">charactersIn</span><span class="p">:</span> <span class="s">" "</span><span class="p">))</span>
        <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">(</span><span class="n">subString</span><span class="p">))</span>

        <span class="k">return</span> <span class="kt">MDHeading3</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseHeadline4</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">data</span> <span class="o">=</span> <span class="n">text</span>
        <span class="n">data</span><span class="o">.</span><span class="nf">removeFirst</span><span class="p">(</span><span class="mi">4</span><span class="p">)</span>
        <span class="k">let</span> <span class="nv">subString</span> <span class="o">=</span> <span class="n">data</span><span class="o">.</span><span class="nf">trimmingCharacters</span><span class="p">(</span><span class="nv">in</span><span class="p">:</span> <span class="kt">CharacterSet</span><span class="p">(</span><span class="nv">charactersIn</span><span class="p">:</span> <span class="s">" "</span><span class="p">))</span>
        <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">(</span><span class="n">subString</span><span class="p">))</span>
        <span class="k">return</span> <span class="kt">MDHeading4</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseHeadline5</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">data</span> <span class="o">=</span> <span class="n">text</span>
        <span class="n">data</span><span class="o">.</span><span class="nf">removeFirst</span><span class="p">(</span><span class="mi">5</span><span class="p">)</span>
        <span class="k">let</span> <span class="nv">subString</span> <span class="o">=</span> <span class="n">data</span><span class="o">.</span><span class="nf">trimmingCharacters</span><span class="p">(</span><span class="nv">in</span><span class="p">:</span> <span class="kt">CharacterSet</span><span class="p">(</span><span class="nv">charactersIn</span><span class="p">:</span> <span class="s">" "</span><span class="p">))</span>
        <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">(</span><span class="n">subString</span><span class="p">))</span>
        <span class="k">return</span> <span class="kt">MDHeading5</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseHeadline6</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">data</span> <span class="o">=</span> <span class="n">text</span>
        <span class="n">data</span><span class="o">.</span><span class="nf">removeFirst</span><span class="p">(</span><span class="mi">6</span><span class="p">)</span>
        <span class="k">let</span> <span class="nv">subString</span> <span class="o">=</span> <span class="n">data</span><span class="o">.</span><span class="nf">trimmingCharacters</span><span class="p">(</span><span class="nv">in</span><span class="p">:</span> <span class="kt">CharacterSet</span><span class="p">(</span><span class="nv">charactersIn</span><span class="p">:</span> <span class="s">" "</span><span class="p">))</span>
        <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">(</span><span class="n">subString</span><span class="p">))</span>
        <span class="k">return</span> <span class="kt">MDHeading6</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseParagragh</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="n">text</span><span class="p">)</span>
        <span class="k">return</span> <span class="kt">MDParagraph</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>


    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseUnorderedList</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">items</span><span class="p">:[</span><span class="kt">MDUnorderedListItem</span><span class="p">]</span> <span class="o">=</span> <span class="p">[</span><span class="kt">MDUnorderedListItem</span><span class="p">]()</span>
        <span class="k">var</span> <span class="nv">span</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">text</span><span class="o">.</span><span class="n">startIndex</span><span class="o">...</span><span class="p">]</span>
        <span class="k">while</span><span class="p">(</span><span class="kc">true</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
            <span class="k">if</span> <span class="k">let</span> <span class="nv">endofLine</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">line</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">span</span><span class="o">.</span><span class="n">startIndex</span><span class="o">..&lt;</span><span class="n">endofLine</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]</span>
                <span class="k">var</span> <span class="nv">lineTxt</span> <span class="o">=</span> <span class="kt">String</span><span class="p">(</span><span class="n">line</span><span class="p">)</span>
                <span class="n">lineTxt</span><span class="o">.</span><span class="nf">removeFirst</span><span class="p">(</span><span class="mi">2</span><span class="p">)</span>
                <span class="k">if</span><span class="p">(</span><span class="n">lineTxt</span><span class="o">.</span><span class="n">count</span> <span class="o">&gt;</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">(</span><span class="n">lineTxt</span><span class="p">))</span>
                    <span class="n">items</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="kt">MDUnorderedListItem</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">,</span> <span class="nv">children</span><span class="p">:</span> <span class="p">[</span><span class="kt">MDUnorderedListItem</span><span class="p">]()))</span>
                <span class="p">${"$"}{"}"}</span>
                <span class="n">span</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">endofLine</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
            <span class="p">${"$"}{"}"}</span> <span class="k">else</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">break</span>
            <span class="p">${"$"}{"}"}</span>
        <span class="p">${"$"}{"}"}</span>

        <span class="k">return</span> <span class="kt">MDUnorderedList</span><span class="p">(</span><span class="nv">items</span><span class="p">:</span> <span class="n">items</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseOrderedList</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">items</span><span class="p">:[</span><span class="kt">MDOrderedListItem</span><span class="p">]</span> <span class="o">=</span> <span class="p">[</span><span class="kt">MDOrderedListItem</span><span class="p">]()</span>
        <span class="k">var</span> <span class="nv">span</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">text</span><span class="o">.</span><span class="n">startIndex</span><span class="o">...</span><span class="p">]</span>
        <span class="k">while</span><span class="p">(</span><span class="kc">true</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
            <span class="k">if</span> <span class="k">let</span> <span class="nv">endofLine</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n</span><span class="s">"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">let</span> <span class="nv">line</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">span</span><span class="o">.</span><span class="n">startIndex</span><span class="o">..&lt;</span><span class="n">endofLine</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]</span>
                <span class="k">var</span> <span class="nv">lineTxt</span> <span class="o">=</span> <span class="kt">String</span><span class="p">(</span><span class="n">line</span><span class="p">)</span>
                <span class="n">lineTxt</span><span class="o">.</span><span class="nf">removeFirst</span><span class="p">(</span><span class="mi">2</span><span class="p">)</span>
                <span class="k">if</span><span class="p">(</span><span class="n">lineTxt</span><span class="o">.</span><span class="n">count</span> <span class="o">&gt;</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">(</span><span class="n">lineTxt</span><span class="p">))</span>
                    <span class="n">items</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="kt">MDOrderedListItem</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">,</span> <span class="nv">children</span><span class="p">:</span> <span class="p">[</span><span class="kt">MDOrderedListItem</span><span class="p">]()))</span>
                <span class="p">${"$"}{"}"}</span>
                <span class="n">span</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">endofLine</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
            <span class="p">${"$"}{"}"}</span> <span class="k">else</span> <span class="p">${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">break</span>
            <span class="p">${"$"}{"}"}</span>
        <span class="p">${"$"}{"}"}</span>

        <span class="k">return</span> <span class="kt">MDOrderedList</span><span class="p">(</span><span class="nv">items</span><span class="p">:</span> <span class="n">items</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseCodeBlock</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">data</span> <span class="o">=</span> <span class="n">text</span>
        <span class="n">data</span><span class="o">.</span><span class="nf">removeFirst</span><span class="p">(</span><span class="mi">3</span><span class="p">)</span>
        <span class="k">let</span> <span class="nv">id</span> <span class="o">=</span> <span class="n">data</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n</span><span class="s">"</span><span class="p">)</span><span class="o">!</span>

        <span class="k">let</span> <span class="nv">langName</span> <span class="o">=</span> <span class="n">data</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">id</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]</span>

        <span class="k">let</span> <span class="nv">content</span> <span class="o">=</span> <span class="n">data</span><span class="p">[</span><span class="n">id</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
        <span class="k">var</span> <span class="nv">contentText</span> <span class="o">=</span> <span class="n">content</span><span class="o">.</span><span class="nf">trimmingCharacters</span><span class="p">(</span><span class="nv">in</span><span class="p">:</span> <span class="kt">CharacterSet</span><span class="p">(</span><span class="nv">charactersIn</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n</span><span class="s">"</span><span class="p">))</span>
        <span class="n">contentText</span><span class="o">.</span><span class="nf">removeLast</span><span class="p">(</span><span class="mi">3</span><span class="p">)</span>

        <span class="k">return</span> <span class="kt">MDCodeBlock</span><span class="p">(</span><span class="nv">lang</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">langName</span><span class="p">),</span> <span class="nv">multilineText</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">contentText</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseBlockQuote</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">MDBlockQuote</span><span class="p">(</span><span class="nv">multilineText</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">text</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseTable</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span> <span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">let</span> <span class="nv">lines</span> <span class="o">=</span> <span class="n">text</span><span class="o">.</span><span class="nf">split</span><span class="p">(</span><span class="nv">separator</span><span class="p">:</span> <span class="s">"</span><span class="se">\\n</span><span class="s">"</span><span class="p">)</span>
        <span class="k">if</span><span class="p">(</span><span class="n">lines</span><span class="o">.</span><span class="n">count</span> <span class="o">&lt;</span> <span class="mi">3</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
            <span class="k">return</span> <span class="nf">parseParagragh</span><span class="p">(</span><span class="n">text</span><span class="p">)</span>
        <span class="p">${"$"}{"}"}</span>

        <span class="k">let</span> <span class="nv">headlineRow</span> <span class="o">=</span> <span class="n">lines</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span>
        <span class="k">let</span> <span class="nv">headlineCellTexts</span> <span class="o">=</span> <span class="n">headlineRow</span><span class="o">.</span><span class="nf">split</span><span class="p">(</span><span class="nv">separator</span><span class="p">:</span> <span class="s">"|"</span><span class="p">)</span>
        <span class="k">let</span> <span class="nv">headlineCells</span> <span class="o">=</span> <span class="n">headlineCellTexts</span><span class="o">.</span><span class="n">map</span><span class="p">${"$"}{"{"${"$"}{"}"}</span><span class="n">txt</span> <span class="k">in</span> <span class="kt">MDTableCell</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="n">txt</span><span class="p">))${"$"}{"}"}</span>

        <span class="k">let</span> <span class="nv">configRow</span> <span class="o">=</span> <span class="n">lines</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span>
        <span class="k">let</span> <span class="nv">configTexts</span>  <span class="o">=</span> <span class="n">configRow</span><span class="o">.</span><span class="nf">split</span><span class="p">(</span><span class="nv">separator</span><span class="p">:</span> <span class="s">"|"</span><span class="p">)</span>
        <span class="k">let</span> <span class="nv">configs</span><span class="p">:[</span><span class="kt">MDTableColConfig</span><span class="p">]</span> <span class="o">=</span> <span class="n">configTexts</span><span class="o">.</span><span class="n">map</span><span class="p">${"$"}{"{"${"$"}{"}"}</span><span class="n">c</span> <span class="k">in</span>
            <span class="k">if</span><span class="p">(</span><span class="n">c</span><span class="p">[</span><span class="n">c</span><span class="o">.</span><span class="n">startIndex</span><span class="p">]</span> <span class="o">==</span> <span class="s">":"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">return</span> <span class="kt">MDTableColConfig</span><span class="o">.</span><span class="n">leading</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">c</span><span class="p">[</span><span class="n">c</span><span class="o">.</span><span class="nf">index</span><span class="p">(</span><span class="nv">before</span><span class="p">:</span> <span class="n">c</span><span class="o">.</span><span class="n">endIndex</span><span class="p">)]</span> <span class="o">==</span> <span class="s">":"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">return</span> <span class="kt">MDTableColConfig</span><span class="o">.</span><span class="n">trailing</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">return</span> <span class="kt">MDTableColConfig</span><span class="o">.</span><span class="n">center</span>
            <span class="p">${"$"}{"}"}</span>
        <span class="p">${"$"}{"}"}</span>

        <span class="k">let</span> <span class="nv">dataRows</span><span class="p">:[</span><span class="kt">MDTableRow</span><span class="p">]</span> <span class="o">=</span> <span class="n">lines</span><span class="p">[</span><span class="mi">2</span><span class="o">...</span><span class="p">]</span><span class="o">.</span><span class="n">map</span><span class="p">${"$"}{"{"${"$"}{"}"}</span><span class="n">line</span> <span class="k">in</span>
            <span class="k">return</span> <span class="kt">MDTableRow</span><span class="p">(</span><span class="nv">cells</span><span class="p">:</span> <span class="n">line</span><span class="o">.</span><span class="nf">split</span><span class="p">(</span><span class="nv">separator</span><span class="p">:</span> <span class="s">"|"</span><span class="p">)</span><span class="o">.</span><span class="n">map</span><span class="p">${"$"}{"{"${"$"}{"}"}</span><span class="n">c</span> <span class="k">in</span>
                <span class="k">let</span> <span class="nv">inlines</span> <span class="o">=</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="n">c</span><span class="p">)</span>
                <span class="k">return</span> <span class="kt">MDTableCell</span><span class="p">(</span><span class="nv">inlines</span><span class="p">:</span> <span class="n">inlines</span><span class="p">)</span>
            <span class="p">${"$"}{"}"})</span>
        <span class="p">${"$"}{"}"}</span>

        <span class="k">return</span> <span class="kt">MDTable</span><span class="p">(</span><span class="nv">headline</span><span class="p">:</span> <span class="kt">MDTableHeader</span><span class="p">(</span><span class="nv">cells</span><span class="p">:</span> <span class="n">headlineCells</span><span class="p">),</span> <span class="nv">colconfigs</span><span class="p">:</span> <span class="kt">MDTableColConfigs</span><span class="p">(</span><span class="nv">colconfigs</span><span class="p">:</span> <span class="n">configs</span><span class="p">),</span> <span class="nv">rows</span><span class="p">:</span> <span class="n">dataRows</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseHorizontalRule</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDHorizontalRule</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">MDHorizontalRule</span><span class="p">(</span><span class="nv">data</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">text</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>


    <span class="kd">internal</span> <span class="kd">func</span> <span class="nf">parseInlineData</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="p">[</span><span class="kt">MDInlineDelegate</span><span class="p">]${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">var</span> <span class="nv">ind</span> <span class="o">=</span> <span class="n">text</span><span class="o">.</span><span class="n">startIndex</span>
        <span class="k">var</span> <span class="nv">ret</span> <span class="o">=</span> <span class="p">[</span><span class="kt">MDInlineDelegate</span><span class="p">]()</span>
        <span class="k">var</span> <span class="nv">txtBuffer</span> <span class="o">=</span> <span class="p">[</span><span class="kt">Character</span><span class="p">]()</span>
        <span class="k">while</span><span class="p">(</span><span class="n">ind</span> <span class="o">!=</span> <span class="n">text</span><span class="o">.</span><span class="n">endIndex</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
            <span class="k">let</span> <span class="nv">nextInd</span> <span class="o">=</span> <span class="n">text</span><span class="o">.</span><span class="nf">index</span><span class="p">(</span><span class="nv">after</span><span class="p">:</span> <span class="n">ind</span><span class="p">)</span>
            <span class="k">let</span> <span class="nv">span</span> <span class="o">=</span> <span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="o">...</span><span class="p">]</span>
            <span class="k">if</span><span class="p">(</span><span class="n">span</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"**"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">start</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"**"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">let</span> <span class="nv">subSpan</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">start</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">subSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"**"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                        <span class="k">if</span><span class="p">(</span><span class="n">txtBuffer</span><span class="o">.</span><span class="n">count</span> <span class="o">!=</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                            <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseText</span><span class="p">(</span><span class="n">txtBuffer</span><span class="p">))</span>
                            <span class="n">txtBuffer</span><span class="o">.</span><span class="nf">removeAll</span><span class="p">()</span>
                        <span class="p">${"$"}{"}"}</span>
                        <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseBold</span><span class="p">(</span><span class="n">subSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                        <span class="n">ind</span> <span class="o">=</span> <span class="n">end</span><span class="o">.</span><span class="n">upperBound</span>
                        <span class="k">continue</span>
                    <span class="p">${"$"}{"}"}</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">span</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"__"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>

                <span class="k">if</span> <span class="k">let</span> <span class="nv">start</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"__"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">let</span> <span class="nv">subSpan</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">start</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">subSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"__"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                        <span class="k">if</span><span class="p">(</span><span class="n">txtBuffer</span><span class="o">.</span><span class="n">count</span> <span class="o">!=</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                            <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseText</span><span class="p">(</span><span class="n">txtBuffer</span><span class="p">))</span>
                            <span class="n">txtBuffer</span><span class="o">.</span><span class="nf">removeAll</span><span class="p">()</span>
                        <span class="p">${"$"}{"}"}</span>
                        <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseBold</span><span class="p">(</span><span class="n">subSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                        <span class="n">ind</span> <span class="o">=</span> <span class="n">end</span><span class="o">.</span><span class="n">upperBound</span>
                        <span class="k">continue</span>
                    <span class="p">${"$"}{"}"}</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">span</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"*"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">start</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"*"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">let</span> <span class="nv">subSpan</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">start</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">subSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"*"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                        <span class="k">if</span><span class="p">(</span><span class="n">txtBuffer</span><span class="o">.</span><span class="n">count</span> <span class="o">!=</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                            <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseText</span><span class="p">(</span><span class="n">txtBuffer</span><span class="p">))</span>
                            <span class="n">txtBuffer</span><span class="o">.</span><span class="nf">removeAll</span><span class="p">()</span>
                        <span class="p">${"$"}{"}"}</span>
                        <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseItalic</span><span class="p">(</span><span class="n">subSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                        <span class="n">ind</span> <span class="o">=</span> <span class="n">end</span><span class="o">.</span><span class="n">upperBound</span>
                        <span class="k">continue</span>
                    <span class="p">${"$"}{"}"}</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">span</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"_"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">start</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"_"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">let</span> <span class="nv">subSpan</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">start</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">subSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"_"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                        <span class="k">if</span><span class="p">(</span><span class="n">txtBuffer</span><span class="o">.</span><span class="n">count</span> <span class="o">!=</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                            <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseText</span><span class="p">(</span><span class="n">txtBuffer</span><span class="p">))</span>
                            <span class="n">txtBuffer</span><span class="o">.</span><span class="nf">removeAll</span><span class="p">()</span>
                        <span class="p">${"$"}{"}"}</span>
                        <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseItalic</span><span class="p">(</span><span class="n">subSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                        <span class="n">ind</span> <span class="o">=</span> <span class="n">end</span><span class="o">.</span><span class="n">upperBound</span>
                        <span class="k">continue</span>
                    <span class="p">${"$"}{"}"}</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">span</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"~~"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">start</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"~~"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">let</span> <span class="nv">subSpan</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">start</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">subSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"~~"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                        <span class="k">if</span><span class="p">(</span><span class="n">txtBuffer</span><span class="o">.</span><span class="n">count</span> <span class="o">!=</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                            <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseText</span><span class="p">(</span><span class="n">txtBuffer</span><span class="p">))</span>
                            <span class="n">txtBuffer</span><span class="o">.</span><span class="nf">removeAll</span><span class="p">()</span>
                        <span class="p">${"$"}{"}"}</span>
                        <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseStrikethrough</span><span class="p">(</span><span class="n">subSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                        <span class="n">ind</span> <span class="o">=</span> <span class="n">end</span><span class="o">.</span><span class="n">upperBound</span>
                        <span class="k">continue</span>
                    <span class="p">${"$"}{"}"}</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">span</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"\`"</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">start</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"\`"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">let</span> <span class="nv">subSpan</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">start</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">subSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"\`"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                        <span class="k">if</span><span class="p">(</span><span class="n">txtBuffer</span><span class="o">.</span><span class="n">count</span> <span class="o">!=</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                            <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseText</span><span class="p">(</span><span class="n">txtBuffer</span><span class="p">))</span>
                            <span class="n">txtBuffer</span><span class="o">.</span><span class="nf">removeAll</span><span class="p">()</span>
                        <span class="p">${"$"}{"}"}</span>
                        <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseInlineCode</span><span class="p">(</span><span class="n">subSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                        <span class="n">ind</span> <span class="o">=</span> <span class="n">end</span><span class="o">.</span><span class="n">upperBound</span>
                        <span class="k">continue</span>
                    <span class="p">${"$"}{"}"}</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">span</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"["</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">nameStart</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"]("</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">var</span> <span class="nv">display</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">nameStart</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]</span>
                    <span class="n">display</span> <span class="o">=</span> <span class="n">display</span><span class="p">[</span><span class="n">display</span><span class="o">.</span><span class="nf">index</span><span class="p">(</span><span class="nv">after</span><span class="p">:</span> <span class="n">display</span><span class="o">.</span><span class="n">startIndex</span><span class="p">)</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">let</span> <span class="nv">subSpan</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">nameStart</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">subSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">")"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                        <span class="k">if</span><span class="p">(</span><span class="n">txtBuffer</span><span class="o">.</span><span class="n">count</span> <span class="o">!=</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                            <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseText</span><span class="p">(</span><span class="n">txtBuffer</span><span class="p">))</span>
                            <span class="n">txtBuffer</span><span class="o">.</span><span class="nf">removeAll</span><span class="p">()</span>
                        <span class="p">${"$"}{"}"}</span>
                        <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseLink</span><span class="p">(</span><span class="n">display</span><span class="p">,</span> <span class="n">subSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                        <span class="n">ind</span> <span class="o">=</span> <span class="n">end</span><span class="o">.</span><span class="n">upperBound</span>
                        <span class="k">continue</span>
                    <span class="p">${"$"}{"}"}</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="n">span</span><span class="o">.</span><span class="nf">starts</span><span class="p">(</span><span class="nv">with</span><span class="p">:</span> <span class="s">"!["</span><span class="p">))${"$"}{"{"${"$"}{"}"}</span>
                <span class="k">if</span> <span class="k">let</span> <span class="nv">nameStart</span> <span class="o">=</span> <span class="n">span</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">"]("</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                    <span class="k">var</span> <span class="nv">display</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">nameStart</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]</span>
                    <span class="n">display</span> <span class="o">=</span> <span class="n">display</span><span class="p">[</span><span class="n">display</span><span class="o">.</span><span class="nf">index</span><span class="p">(</span><span class="nv">after</span><span class="p">:</span> <span class="n">display</span><span class="o">.</span><span class="n">startIndex</span><span class="p">)</span><span class="o">...</span><span class="p">]</span>
                    <span class="n">display</span> <span class="o">=</span> <span class="n">display</span><span class="p">[</span><span class="n">display</span><span class="o">.</span><span class="nf">index</span><span class="p">(</span><span class="nv">after</span><span class="p">:</span> <span class="n">display</span><span class="o">.</span><span class="n">startIndex</span><span class="p">)</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">let</span> <span class="nv">subSpan</span> <span class="o">=</span> <span class="n">span</span><span class="p">[</span><span class="n">nameStart</span><span class="o">.</span><span class="n">upperBound</span><span class="o">...</span><span class="p">]</span>
                    <span class="k">if</span> <span class="k">let</span> <span class="nv">end</span> <span class="o">=</span> <span class="n">subSpan</span><span class="o">.</span><span class="nf">range</span><span class="p">(</span><span class="nv">of</span><span class="p">:</span> <span class="s">")"</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                        <span class="k">if</span><span class="p">(</span><span class="n">txtBuffer</span><span class="o">.</span><span class="n">count</span> <span class="o">!=</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
                            <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseText</span><span class="p">(</span><span class="n">txtBuffer</span><span class="p">))</span>
                            <span class="n">txtBuffer</span><span class="o">.</span><span class="nf">removeAll</span><span class="p">()</span>
                        <span class="p">${"$"}{"}"}</span>
                        <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseImage</span><span class="p">(</span><span class="n">display</span><span class="p">,</span> <span class="n">subSpan</span><span class="p">[</span><span class="o">..&lt;</span><span class="n">end</span><span class="o">.</span><span class="n">lowerBound</span><span class="p">]))</span>
                        <span class="n">ind</span> <span class="o">=</span> <span class="n">end</span><span class="o">.</span><span class="n">upperBound</span>
                        <span class="k">continue</span>
                    <span class="p">${"$"}{"}"}</span>
                <span class="p">${"$"}{"}"}</span>
            <span class="p">${"$"}{"}"}</span>
            <span class="k">else</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
                <span class="n">txtBuffer</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="n">text</span><span class="p">[</span><span class="n">ind</span><span class="p">])</span>
            <span class="p">${"$"}{"}"}</span>

            <span class="n">ind</span> <span class="o">=</span> <span class="n">nextInd</span>
        <span class="p">${"$"}{"}"}</span>
        <span class="k">if</span><span class="p">(</span><span class="n">txtBuffer</span><span class="o">.</span><span class="n">count</span> <span class="o">!=</span> <span class="mi">0</span><span class="p">)${"$"}{"{"${"$"}{"}"}</span>
            <span class="n">ret</span><span class="o">.</span><span class="nf">append</span><span class="p">(</span><span class="nf">parseText</span><span class="p">(</span><span class="n">txtBuffer</span><span class="p">))</span>
        <span class="p">${"$"}{"}"}</span>
        <span class="k">return</span> <span class="n">ret</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseBold</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDBold</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">MDBold</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="p">(</span><span class="n">text</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseInlineCode</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span> <span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDInlineCode</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">MDInlineCode</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">text</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseItalic</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDItalic</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">MDItalic</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">text</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseStrikethrough</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDStrikethrough</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">MDStrikethrough</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">text</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseLink</span><span class="p">(</span><span class="n">_</span> <span class="nv">name</span><span class="p">:</span> <span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">,</span> <span class="n">_</span> <span class="nv">address</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDLink</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">MDLink</span><span class="p">(</span><span class="nv">name</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">name</span><span class="p">),</span> <span class="nv">source</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">address</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseImage</span><span class="p">(</span><span class="n">_</span> <span class="nv">name</span><span class="p">:</span><span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">,</span> <span class="n">_</span> <span class="nv">address</span><span class="p">:</span> <span class="kt">String</span><span class="o">.</span><span class="kt">SubSequence</span><span class="p">)</span> <span class="o">-&gt;</span> <span class="kt">MDImage</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">return</span> <span class="kt">MDImage</span><span class="p">(</span><span class="nv">name</span><span class="p">:</span><span class="kt">String</span><span class="p">(</span><span class="n">name</span><span class="p">),</span> <span class="nv">source</span><span class="p">:</span> <span class="kt">String</span><span class="p">(</span><span class="n">address</span><span class="p">))</span>
    <span class="p">${"$"}{"}"}</span>

    <span class="kd">private</span> <span class="kd">func</span> <span class="nf">parseText</span><span class="p">(</span><span class="n">_</span> <span class="nv">text</span><span class="p">:[</span><span class="kt">Character</span><span class="p">])</span> <span class="o">-&gt;</span> <span class="kt">MDText</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
        <span class="k">let</span> <span class="nv">txt</span> <span class="o">=</span> <span class="kt">String</span><span class="p">(</span><span class="n">text</span><span class="p">)</span>
        <span class="k">return</span> <span class="kt">MDText</span><span class="p">(</span><span class="nv">text</span><span class="p">:</span> <span class="n">txt</span><span class="p">)</span>
    <span class="p">${"$"}{"}"}</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDSyntaxTree</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">blocks</span><span class="p">:[</span><span class="kt">MDBlockDelegate</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDBold</span><span class="p">:</span> <span class="kt">MDInlineDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDStrikethrough</span><span class="p">:</span> <span class="kt">MDInlineDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDItalic</span><span class="p">:</span><span class="kt">MDInlineDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDLink</span><span class="p">:</span> <span class="kt">MDInlineDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">name</span><span class="p">:</span><span class="kt">String</span>
    <span class="k">var</span> <span class="nv">source</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDImage</span><span class="p">:</span> <span class="kt">MDInlineDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">name</span><span class="p">:</span><span class="kt">String</span>
    <span class="k">var</span> <span class="nv">source</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDInlineCode</span> <span class="p">:</span> <span class="kt">MDInlineDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDText</span><span class="p">:</span> <span class="kt">MDInlineDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">text</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDHeading1</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDHeading2</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDHeading3</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDHeading4</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDHeading5</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDHeading6</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDParagraph</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDUnorderedList</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">items</span><span class="p">:[</span><span class="kt">MDUnorderedListItem</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDUnorderedListItem</span>
<span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
    <span class="k">var</span> <span class="nv">children</span><span class="p">:[</span><span class="kt">MDUnorderedListItem</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDOrderedList</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">items</span><span class="p">:[</span><span class="kt">MDOrderedListItem</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDOrderedListItem</span>
<span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
    <span class="k">var</span> <span class="nv">children</span><span class="p">:[</span><span class="kt">MDOrderedListItem</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDCodeBlock</span> <span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">lang</span><span class="p">:</span><span class="kt">String</span>
    <span class="k">var</span> <span class="nv">multilineText</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDHorizontalRule</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>

    <span class="k">var</span> <span class="nv">data</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDBlockQuote</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>

    <span class="k">var</span> <span class="nv">multilineText</span><span class="p">:</span><span class="kt">String</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDTable</span><span class="p">:</span> <span class="kt">MDBlockDelegate</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">headline</span><span class="p">:</span><span class="kt">MDTableHeader</span>
    <span class="k">var</span> <span class="nv">colconfigs</span><span class="p">:</span><span class="kt">MDTableColConfigs</span>
    <span class="k">var</span> <span class="nv">rows</span><span class="p">:[</span><span class="kt">MDTableRow</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDTableHeader</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">cells</span><span class="p">:[</span><span class="kt">MDTableCell</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDTableCell</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">inlines</span><span class="p">:[</span><span class="kt">MDInlineDelegate</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDTableColConfigs</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">colconfigs</span><span class="p">:[</span><span class="kt">MDTableColConfig</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">enum</span> <span class="kt">MDTableColConfig</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">case</span> <span class="n">leading</span>
    <span class="k">case</span> <span class="n">trailing</span>
    <span class="k">case</span> <span class="n">center</span>
<span class="p">${"$"}{"}"}</span>

<span class="kd">struct</span> <span class="kt">MDTableRow</span><span class="p">${"$"}{"{"${"$"}{"}"}</span>
    <span class="k">var</span> <span class="nv">cells</span><span class="p">:[</span><span class="kt">MDTableCell</span><span class="p">]</span>
<span class="p">${"$"}{"}"}</span>
</code></pre></div></div>
`,body: `Markdownをレンダリングしてくれるパッケージはあるけど、オブジェクトツリーにしてくれるものは無いなと思ったのでやってみてます。

オブジェクトツリーに変換できるとコードからMarkdownを扱いやすくなるんじゃないかと思ってます。


続きはこちら:[Swift：開発中のMarkdown解析パッケージをもう少しテストしやすくする](https://qiita.com/sYamaz/items/31ef5374ad7c9a0dfde4)

# 環境

* Xcode 13

# Tryした解析の考え方

Markdownの記法は以下の2つに分類できると考えました

* \`# h1\`やリスト、引用文などの１行〜複数行の役割が決まる定義
* \`**bold**\`や\`[name](link)\`などの１行の中で繰り返し使用できる定義

仮にこの記事では前者をブロック要素、後者をインライン要素と名付けると、ブロック要素の中にはインライン要素が含まれる可能性がありますが、逆のパターンは存在しません。（命名が意味不明だったらすみません）

したがって、以下のサンプルMarkdownの構造をツリーとして表現すると次のような形になると考えます

##### サンプルMarkdown

\`\`\` markdown

# Tryした解析の考え方

Markdownの記法は以下の２つに分類できると考えました

* \`# h1\`やリスト、引用文などの１行〜複数行の役割が決まる定義
* \`**bold**\`や\`[name](link)\`などの１行の中で繰り返し使用できる定義

仮にこの記事では前者をブロック要素、後者をインライン要素と名付けると、ブロック要素の中にはインライン要素が含まれる可能性がありますが、逆のパターンは存在しません。

\`\`\`

##### ツリー

* Markdownツリー
  * ブロック要素 h1要素
     * インライン要素 テキスト「\`Tryした解析の考え方\`」
  * ブロック要素 段落要素
     * インライン要素 テキスト「\`Markdownの記法は以下の２つに分類できると考えました\`」
  * ブロック要素 リスト要素
     * ブロック要素 リスト項目要素
         * インライン要素 コード「\`# h1\`」
         * インライン要素 テキスト「\`や、リスト、引用文などの1行〜複数行の役割が決まる定義\`」
     * ブロック要素 リスト項目要素
         * インライン要素 太字「\`bold\`」
         * インライン要素 テキスト「\`や\`」
         * インライン要素 リンク「\`[name](link)\`」
         * インライン要素 テキスト「\`などの１行の中で繰り返し使用できる定義\`」

  * ブロック要素 段落要素
     * インライン要素 テキスト「\`仮にこの記事では前者をブロック要素、後者をインライン要素と名付けると、ブロック要素の中にはインライン要素が含まれる可能性がありますが、逆のパターンは存在しません。\`」

# 結果

Swiftでこれらを表現した結果（一部不十分な実装あり）をGithubのリポジトリに作成しました。今後、バグ修正しつつPackageとして使えるようにしていこうと思ってます。

https://github.com/sYamaz/MarkdownAnalyzer

2021.9.26時点のコード。

\`\`\` swift
import Foundation
import SwiftUI

protocol MDNodeDelegate${"$"}{"{"${"$"}{"}"}${"$"}{"}"}

protocol MDBlockDelegate : MDNodeDelegate${"$"}{"{"${"$"}{"}"}${"$"}{"}"}

protocol MDInlineDelegate : MDNodeDelegate${"$"}{"{"${"$"}{"}"}${"$"}{"}"}

public class MarkdownAnalyzer
${"$"}{"{"${"$"}{"}"}
    func parse(_ text: String) -> MDSyntaxTree${"$"}{"{"${"$"}{"}"}
        var blocks = [MDBlockDelegate]()
        // blockに分割する
        var ind = text.startIndex
        while(ind != text.endIndex)${"$"}{"{"${"$"}{"}"}
            var nextInd = text.index(after: ind)
            if(text[ind...].starts(with: "# "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline1(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"} else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline1(blockSpan))
                    break
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "## "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline2(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"} else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline2(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "### "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline3(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline3(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "#### "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline4(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline4(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "##### "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline5(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline5(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "###### "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline6(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHeadline6(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "---\\n\\n"))${"$"}{"{"${"$"}{"}"}
                if let r = text[ind...].range(of: "---\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHorizontalRule("---\\n\\n"))
                    nextInd = r.upperBound
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "===\\n\\n"))${"$"}{"{"${"$"}{"}"}
                if let r = text[ind...].range(of: "===\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseHorizontalRule("===\\n\\n"))
                    nextInd = r.upperBound
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "\`\`\`"))${"$"}{"{"${"$"}{"}"}
                if let start = text[ind...].range(of: "\`\`\`")${"$"}{"{"${"$"}{"}"}
                    if let end = text[start.upperBound...].range(of: "\`\`\`\\n\\n")${"$"}{"{"${"$"}{"}"}
                        
                        blocks.append(parseCodeBlock(text[ind..<end.upperBound]))
                        nextInd = end.upperBound
                    ${"$"}{"}"}
                    else${"$"}{"{"${"$"}{"}"}
                        break;
                    ${"$"}{"}"}
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "- "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseUnorderedList(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseUnorderedList(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "* "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseUnorderedList(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseUnorderedList(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "+ "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseUnorderedList(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseUnorderedList(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "1. "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseOrderedList(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseOrderedList(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "> "))${"$"}{"{"${"$"}{"}"}
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseBlockQuote(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseBlockQuote(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(text[ind...].starts(with: "|"))${"$"}{"{"${"$"}{"}"}
                //table or paragragh
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "|\\n\\n")${"$"}{"{"${"$"}{"}"}
                    
                    blocks.append(parseTable(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseParagragh(blockSpan))
                    break
                ${"$"}{"}"}
            ${"$"}{"}"}
            else${"$"}{"{"${"$"}{"}"} // paragragh
                let blockSpan = text[ind...]
                if let r = blockSpan.range(of: "\\n\\n")${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseParagragh(blockSpan[..<r.lowerBound]))
                    nextInd = r.upperBound
                ${"$"}{"}"}else${"$"}{"{"${"$"}{"}"}
                    blocks.append(parseParagragh(blockSpan))
                    break;
                ${"$"}{"}"}
            ${"$"}{"}"}
            
            ind = nextInd
        ${"$"}{"}"}
        
        let ret = MDSyntaxTree(blocks: blocks)
        return ret
    ${"$"}{"}"}
    
    private func parseHeadline1(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        var data = text
        data.removeFirst(1)
        let subString = data.trimmingCharacters(in: CharacterSet(charactersIn: " "))
        let inlines = parseInlineData(String.SubSequence(subString))
        return MDHeading1(inlines: inlines)
    ${"$"}{"}"}
    
    private func parseHeadline2(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        var data = text
        data.removeFirst(2)
        let subString = data.trimmingCharacters(in: CharacterSet(charactersIn: " "))
        let inlines = parseInlineData(String.SubSequence(subString))
        return MDHeading2(inlines: inlines)
    ${"$"}{"}"}
    
    private func parseHeadline3(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        var data = text
        data.removeFirst(3)
        let subString = data.trimmingCharacters(in: CharacterSet(charactersIn: " "))
        let inlines = parseInlineData(String.SubSequence(subString))
        
        return MDHeading3(inlines: inlines)
    ${"$"}{"}"}
    
    private func parseHeadline4(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        var data = text
        data.removeFirst(4)
        let subString = data.trimmingCharacters(in: CharacterSet(charactersIn: " "))
        let inlines = parseInlineData(String.SubSequence(subString))
        return MDHeading4(inlines: inlines)
    ${"$"}{"}"}
    
    private func parseHeadline5(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        var data = text
        data.removeFirst(5)
        let subString = data.trimmingCharacters(in: CharacterSet(charactersIn: " "))
        let inlines = parseInlineData(String.SubSequence(subString))
        return MDHeading5(inlines: inlines)
    ${"$"}{"}"}
    
    private func parseHeadline6(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        var data = text
        data.removeFirst(6)
        let subString = data.trimmingCharacters(in: CharacterSet(charactersIn: " "))
        let inlines = parseInlineData(String.SubSequence(subString))
        return MDHeading6(inlines: inlines)
    ${"$"}{"}"}
    
    private func parseParagragh(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        let inlines = parseInlineData(text)
        return MDParagraph(inlines: inlines)
    ${"$"}{"}"}
    
    
    private func parseUnorderedList(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        var items:[MDUnorderedListItem] = [MDUnorderedListItem]()
        var span = text[text.startIndex...]
        while(true)${"$"}{"{"${"$"}{"}"}
            if let endofLine = span.range(of: "\\n")${"$"}{"{"${"$"}{"}"}
                let line = span[span.startIndex..<endofLine.lowerBound]
                var lineTxt = String(line)
                lineTxt.removeFirst(2)
                if(lineTxt.count > 0)${"$"}{"{"${"$"}{"}"}
                    let inlines = parseInlineData(String.SubSequence(lineTxt))
                    items.append(MDUnorderedListItem(inlines: inlines, children: [MDUnorderedListItem]()))
                ${"$"}{"}"}
                span = span[endofLine.upperBound...]
            ${"$"}{"}"} else ${"$"}{"{"${"$"}{"}"}
                break
            ${"$"}{"}"}
        ${"$"}{"}"}
        
        return MDUnorderedList(items: items)
    ${"$"}{"}"}
    
    private func parseOrderedList(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        var items:[MDOrderedListItem] = [MDOrderedListItem]()
        var span = text[text.startIndex...]
        while(true)${"$"}{"{"${"$"}{"}"}
            if let endofLine = span.range(of: "\\n")${"$"}{"{"${"$"}{"}"}
                let line = span[span.startIndex..<endofLine.lowerBound]
                var lineTxt = String(line)
                lineTxt.removeFirst(2)
                if(lineTxt.count > 0)${"$"}{"{"${"$"}{"}"}
                    let inlines = parseInlineData(String.SubSequence(lineTxt))
                    items.append(MDOrderedListItem(inlines: inlines, children: [MDOrderedListItem]()))
                ${"$"}{"}"}
                span = span[endofLine.upperBound...]
            ${"$"}{"}"} else ${"$"}{"{"${"$"}{"}"}
                break
            ${"$"}{"}"}
        ${"$"}{"}"}
        
        return MDOrderedList(items: items)
    ${"$"}{"}"}
    
    private func parseCodeBlock(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        var data = text
        data.removeFirst(3)
        let id = data.range(of: "\\n")!
        
        let langName = data[..<id.lowerBound]
        
        let content = data[id.upperBound...]
        var contentText = content.trimmingCharacters(in: CharacterSet(charactersIn: "\\n"))
        contentText.removeLast(3)
        
        return MDCodeBlock(lang: String(langName), multilineText: String(contentText))
    ${"$"}{"}"}
    
    private func parseBlockQuote(_ text:String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        return MDBlockQuote(multilineText: String(text))
    ${"$"}{"}"}
    
    private func parseTable(_ text: String.SubSequence) -> MDBlockDelegate${"$"}{"{"${"$"}{"}"}
        let lines = text.split(separator: "\\n")
        if(lines.count < 3)${"$"}{"{"${"$"}{"}"}
            return parseParagragh(text)
        ${"$"}{"}"}
        
        let headlineRow = lines[0]
        let headlineCellTexts = headlineRow.split(separator: "|")
        let headlineCells = headlineCellTexts.map${"$"}{"{"${"$"}{"}"}txt in MDTableCell(inlines: parseInlineData(txt))${"$"}{"}"}
        
        let configRow = lines[1]
        let configTexts  = configRow.split(separator: "|")
        let configs:[MDTableColConfig] = configTexts.map${"$"}{"{"${"$"}{"}"}c in
            if(c[c.startIndex] == ":")${"$"}{"{"${"$"}{"}"}
                return MDTableColConfig.leading
            ${"$"}{"}"}
            else if(c[c.index(before: c.endIndex)] == ":")${"$"}{"{"${"$"}{"}"}
                return MDTableColConfig.trailing
            ${"$"}{"}"}
            else${"$"}{"{"${"$"}{"}"}
                return MDTableColConfig.center
            ${"$"}{"}"}
        ${"$"}{"}"}
        
        let dataRows:[MDTableRow] = lines[2...].map${"$"}{"{"${"$"}{"}"}line in
            return MDTableRow(cells: line.split(separator: "|").map${"$"}{"{"${"$"}{"}"}c in
                let inlines = parseInlineData(c)
                return MDTableCell(inlines: inlines)
            ${"$"}{"}"})
        ${"$"}{"}"}
        
        return MDTable(headline: MDTableHeader(cells: headlineCells), colconfigs: MDTableColConfigs(colconfigs: configs), rows: dataRows)
    ${"$"}{"}"}
    
    private func parseHorizontalRule(_ text:String.SubSequence) -> MDHorizontalRule${"$"}{"{"${"$"}{"}"}
        return MDHorizontalRule(data: String(text))
    ${"$"}{"}"}
    
    
    internal func parseInlineData(_ text:String.SubSequence) -> [MDInlineDelegate]${"$"}{"{"${"$"}{"}"}
        var ind = text.startIndex
        var ret = [MDInlineDelegate]()
        var txtBuffer = [Character]()
        while(ind != text.endIndex)${"$"}{"{"${"$"}{"}"}
            let nextInd = text.index(after: ind)
            let span = text[ind...]
            if(span.starts(with: "**"))${"$"}{"{"${"$"}{"}"}
                if let start = span.range(of: "**")${"$"}{"{"${"$"}{"}"}
                    let subSpan = span[start.upperBound...]
                    if let end = subSpan.range(of: "**")${"$"}{"{"${"$"}{"}"}
                        if(txtBuffer.count != 0)${"$"}{"{"${"$"}{"}"}
                            ret.append(parseText(txtBuffer))
                            txtBuffer.removeAll()
                        ${"$"}{"}"}
                        ret.append(parseBold(subSpan[..<end.lowerBound]))
                        ind = end.upperBound
                        continue
                    ${"$"}{"}"}
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(span.starts(with: "__"))${"$"}{"{"${"$"}{"}"}
                
                if let start = span.range(of: "__")${"$"}{"{"${"$"}{"}"}
                    let subSpan = span[start.upperBound...]
                    if let end = subSpan.range(of: "__")${"$"}{"{"${"$"}{"}"}
                        if(txtBuffer.count != 0)${"$"}{"{"${"$"}{"}"}
                            ret.append(parseText(txtBuffer))
                            txtBuffer.removeAll()
                        ${"$"}{"}"}
                        ret.append(parseBold(subSpan[..<end.lowerBound]))
                        ind = end.upperBound
                        continue
                    ${"$"}{"}"}
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(span.starts(with: "*"))${"$"}{"{"${"$"}{"}"}
                if let start = span.range(of: "*")${"$"}{"{"${"$"}{"}"}
                    let subSpan = span[start.upperBound...]
                    if let end = subSpan.range(of: "*")${"$"}{"{"${"$"}{"}"}
                        if(txtBuffer.count != 0)${"$"}{"{"${"$"}{"}"}
                            ret.append(parseText(txtBuffer))
                            txtBuffer.removeAll()
                        ${"$"}{"}"}
                        ret.append(parseItalic(subSpan[..<end.lowerBound]))
                        ind = end.upperBound
                        continue
                    ${"$"}{"}"}
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(span.starts(with: "_"))${"$"}{"{"${"$"}{"}"}
                if let start = span.range(of: "_")${"$"}{"{"${"$"}{"}"}
                    let subSpan = span[start.upperBound...]
                    if let end = subSpan.range(of: "_")${"$"}{"{"${"$"}{"}"}
                        if(txtBuffer.count != 0)${"$"}{"{"${"$"}{"}"}
                            ret.append(parseText(txtBuffer))
                            txtBuffer.removeAll()
                        ${"$"}{"}"}
                        ret.append(parseItalic(subSpan[..<end.lowerBound]))
                        ind = end.upperBound
                        continue
                    ${"$"}{"}"}
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(span.starts(with: "~~"))${"$"}{"{"${"$"}{"}"}
                if let start = span.range(of: "~~")${"$"}{"{"${"$"}{"}"}
                    let subSpan = span[start.upperBound...]
                    if let end = subSpan.range(of: "~~")${"$"}{"{"${"$"}{"}"}
                        if(txtBuffer.count != 0)${"$"}{"{"${"$"}{"}"}
                            ret.append(parseText(txtBuffer))
                            txtBuffer.removeAll()
                        ${"$"}{"}"}
                        ret.append(parseStrikethrough(subSpan[..<end.lowerBound]))
                        ind = end.upperBound
                        continue
                    ${"$"}{"}"}
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(span.starts(with: "\`"))${"$"}{"{"${"$"}{"}"}
                if let start = span.range(of: "\`")${"$"}{"{"${"$"}{"}"}
                    let subSpan = span[start.upperBound...]
                    if let end = subSpan.range(of: "\`")${"$"}{"{"${"$"}{"}"}
                        if(txtBuffer.count != 0)${"$"}{"{"${"$"}{"}"}
                            ret.append(parseText(txtBuffer))
                            txtBuffer.removeAll()
                        ${"$"}{"}"}
                        ret.append(parseInlineCode(subSpan[..<end.lowerBound]))
                        ind = end.upperBound
                        continue
                    ${"$"}{"}"}
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(span.starts(with: "["))${"$"}{"{"${"$"}{"}"}
                if let nameStart = span.range(of: "](")${"$"}{"{"${"$"}{"}"}
                    var display = span[..<nameStart.lowerBound]
                    display = display[display.index(after: display.startIndex)...]
                    let subSpan = span[nameStart.upperBound...]
                    if let end = subSpan.range(of: ")")${"$"}{"{"${"$"}{"}"}
                        if(txtBuffer.count != 0)${"$"}{"{"${"$"}{"}"}
                            ret.append(parseText(txtBuffer))
                            txtBuffer.removeAll()
                        ${"$"}{"}"}
                        ret.append(parseLink(display, subSpan[..<end.lowerBound]))
                        ind = end.upperBound
                        continue
                    ${"$"}{"}"}
                ${"$"}{"}"}
            ${"$"}{"}"}
            else if(span.starts(with: "!["))${"$"}{"{"${"$"}{"}"}
                if let nameStart = span.range(of: "](")${"$"}{"{"${"$"}{"}"}
                    var display = span[..<nameStart.lowerBound]
                    display = display[display.index(after: display.startIndex)...]
                    display = display[display.index(after: display.startIndex)...]
                    let subSpan = span[nameStart.upperBound...]
                    if let end = subSpan.range(of: ")")${"$"}{"{"${"$"}{"}"}
                        if(txtBuffer.count != 0)${"$"}{"{"${"$"}{"}"}
                            ret.append(parseText(txtBuffer))
                            txtBuffer.removeAll()
                        ${"$"}{"}"}
                        ret.append(parseImage(display, subSpan[..<end.lowerBound]))
                        ind = end.upperBound
                        continue
                    ${"$"}{"}"}
                ${"$"}{"}"}
            ${"$"}{"}"}
            else${"$"}{"{"${"$"}{"}"}
                txtBuffer.append(text[ind])
            ${"$"}{"}"}
            
            ind = nextInd
        ${"$"}{"}"}
        if(txtBuffer.count != 0)${"$"}{"{"${"$"}{"}"}
            ret.append(parseText(txtBuffer))
        ${"$"}{"}"}
        return ret
    ${"$"}{"}"}
    
    private func parseBold(_ text:String.SubSequence) -> MDBold${"$"}{"{"${"$"}{"}"}
        return MDBold(text:String(text))
    ${"$"}{"}"}
    
    private func parseInlineCode(_ text: String.SubSequence) -> MDInlineCode${"$"}{"{"${"$"}{"}"}
        return MDInlineCode(text: String(text))
    ${"$"}{"}"}
    
    private func parseItalic(_ text:String.SubSequence) -> MDItalic${"$"}{"{"${"$"}{"}"}
        return MDItalic(text: String(text))
    ${"$"}{"}"}
    
    private func parseStrikethrough(_ text:String.SubSequence) -> MDStrikethrough${"$"}{"{"${"$"}{"}"}
        return MDStrikethrough(text: String(text))
    ${"$"}{"}"}
    
    private func parseLink(_ name: String.SubSequence, _ address:String.SubSequence) -> MDLink${"$"}{"{"${"$"}{"}"}
        return MDLink(name: String(name), source: String(address))
    ${"$"}{"}"}
    
    private func parseImage(_ name:String.SubSequence, _ address: String.SubSequence) -> MDImage${"$"}{"{"${"$"}{"}"}
        return MDImage(name:String(name), source: String(address))
    ${"$"}{"}"}
    
    private func parseText(_ text:[Character]) -> MDText${"$"}{"{"${"$"}{"}"}
        let txt = String(text)
        return MDText(text: txt)
    ${"$"}{"}"}
${"$"}{"}"}

struct MDSyntaxTree${"$"}{"{"${"$"}{"}"}
    var blocks:[MDBlockDelegate]
${"$"}{"}"}

struct MDBold: MDInlineDelegate${"$"}{"{"${"$"}{"}"}
    var text:String
${"$"}{"}"}

struct MDStrikethrough: MDInlineDelegate${"$"}{"{"${"$"}{"}"}
    var text:String
${"$"}{"}"}

struct MDItalic:MDInlineDelegate${"$"}{"{"${"$"}{"}"}
    var text:String
${"$"}{"}"}

struct MDLink: MDInlineDelegate${"$"}{"{"${"$"}{"}"}
    var name:String
    var source:String
${"$"}{"}"}

struct MDImage: MDInlineDelegate${"$"}{"{"${"$"}{"}"}
    var name:String
    var source:String
${"$"}{"}"}

struct MDInlineCode : MDInlineDelegate${"$"}{"{"${"$"}{"}"}
    var text:String
${"$"}{"}"}

struct MDText: MDInlineDelegate${"$"}{"{"${"$"}{"}"}
    var text:String
${"$"}{"}"}

struct MDHeading1: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
${"$"}{"}"}

struct MDHeading2: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
${"$"}{"}"}

struct MDHeading3: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
${"$"}{"}"}

struct MDHeading4: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
${"$"}{"}"}

struct MDHeading5: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
${"$"}{"}"}

struct MDHeading6: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
${"$"}{"}"}

struct MDParagraph: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
${"$"}{"}"}

struct MDUnorderedList: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var items:[MDUnorderedListItem]
${"$"}{"}"}

struct MDUnorderedListItem
${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
    var children:[MDUnorderedListItem]
${"$"}{"}"}

struct MDOrderedList: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var items:[MDOrderedListItem]
${"$"}{"}"}

struct MDOrderedListItem
${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
    var children:[MDOrderedListItem]
${"$"}{"}"}

struct MDCodeBlock : MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var lang:String
    var multilineText:String
${"$"}{"}"}

struct MDHorizontalRule: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    
    var data:String
${"$"}{"}"}

struct MDBlockQuote: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    
    var multilineText:String
${"$"}{"}"}

struct MDTable: MDBlockDelegate${"$"}{"{"${"$"}{"}"}
    var headline:MDTableHeader
    var colconfigs:MDTableColConfigs
    var rows:[MDTableRow]
${"$"}{"}"}

struct MDTableHeader${"$"}{"{"${"$"}{"}"}
    var cells:[MDTableCell]
${"$"}{"}"}

struct MDTableCell${"$"}{"{"${"$"}{"}"}
    var inlines:[MDInlineDelegate]
${"$"}{"}"}

struct MDTableColConfigs${"$"}{"{"${"$"}{"}"}
    var colconfigs:[MDTableColConfig]
${"$"}{"}"}

enum MDTableColConfig${"$"}{"{"${"$"}{"}"}
    case leading
    case trailing
    case center
${"$"}{"}"}

struct MDTableRow${"$"}{"{"${"$"}{"}"}
    var cells:[MDTableCell]
${"$"}{"}"}
\`\`\`
`,coediting: false,comments_count: 0,created_at: '2021-09-26T22:19:57+09:00',group: '{ }',id: '1a29a2cb5b3207ad87dc',likes_count: 3,private: false,reactions_count: 0,tags: [{name: 'Markdown',versions: [  ]},{name: '構文解析',versions: [  ]},{name: 'Swift',versions: [  ]}],title: 'SwiftでMarkdownを解析してオブジェクトツリーに変換する',updated_at: '2021-10-06T07:54:17+09:00',url: 'https://qiita.com/sYamaz/items/1a29a2cb5b3207ad87dc',user: {description: `職業Web (フロントエンド、バックエンド）開発者。vue,nuxt,go,awsなど。

過去dotnetを使ってたこともありました。`,facebook_id: '',followees_count: 0,followers_count: 1,github_login_name: 'sYamaz',id: 'sYamaz',items_count: 16,linkedin_id: 'shun-yamazaki/',location: '',name: 'Shun Yamazaki',organization: '',permanent_id: '2088399',profile_image_url: 'https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2088399/profile-images/1639196322',team_only: false,twitter_screen_name: 'ShunYamazaki5',website_url: 'https://syamaz.github.io/website-nuxt/'},page_views_count: null,team_membership: { }}]