# amazon-link-parser

- 記事内のAmazon広告リンクを変換するツールです。
  - `cheerio`等を用いて記事からASINを取得する。
  - `paapi5-nodejs-sdk`を用いてProduct Advertising APIから商品情報を取得する。
  - 商品情報からHTMLを作成して記事に埋め込む。

## 使用方法

- サーバ側
  - <a href="/src/settings.ts">settings.ts</a> に各種設定を記述します。
    - `FileSettings`: テキストファイルの格納パス
    - `AmazonPaApiSettings`: Amazon Product Adcertising API の設定
    - `AmazonParseSettings`: AmazonアイテムHTML変換設定(※必要に応じて修正)
- クライアント側

  - HTMLテキスト内の古いAmazonリンクを一括変換する場合 (初回のみ)
    ```
    # フォルダ内のファイル全てが対象
    npx ts-node --files src/main-parse-old-all-link.ts
    ```
    - iframeタグ、imgタグからASINを抜き出してHTMLに変換しています。
  - Markdown内のAmazonリンクを変換する場合

    ```
    # 対象のファイルを指定する
    npx ts-node --files src/main-parse-md-link.ts [file path]
    ```

    - divタグ、aタグからASINを抜き出してHTMLに変換しています。
    - Markdown側での指定方法

      ```
      # Amazon商品アイテム
      <div data-asin-id="XXX">
      Amazonアイテム
      </div>

      # Amazon画像リンク
      <a data-img-link-asin-id="XXX">
      Amazon画像
      </a>
      ```

  - HTMLテキスト、MarkdownファイルのAmazonリンクを一括更新する場合

    ```
    # 対象のファイルを指定する
    npx ts-node --files src/main-update-all-link.ts
    ```

  - ASINからAmazonリンクをコンソール出力する場合
    ```
    # 引数でASINを指定する
    # カンマ区切りで複数指定可能
    npx ts-node --files src/main-print-link.ts [ASIN],[ASIN]
    ```
    - `画像リンク+タイトルリンク -> 商品アイテムリンク`の順番で出力します。
