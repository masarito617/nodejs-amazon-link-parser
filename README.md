# amazon-link-parser

- 記事内の Amazon 広告リンクを変換するツールです。
  - `cheerio`等を用いて記事から ASIN を取得する。
  - `paapi5-nodejs-sdk`を用いて Product Advertising API から商品情報を取得する。
  - 商品情報から HTML を作成して記事に埋め込む。

## 使用方法

- サーバ側
  - <a href="/src/settings.ts">settings.ts</a> に各種設定を記述します。
    - `FileSettings`: テキストファイルの格納パス
    - `AmazonPaApiSettings`: Amazon Product Adcertising API の設定
    - `AmazonParseSettings`: Amazon アイテム HTML 変換設定(※必要に応じて修正)
- クライアント側

  - HTML テキスト内の古い Amazon リンクを一括変換する場合 (初回のみ)
    ```
    # フォルダ内のファイル全てが対象
    npx ts-node --files src/main-parse-old-all-link.ts
    ```
    - iframe タグ、img タグから ASIN を抜き出して HTML に変換しています。
  - Markdown 内の Amazon リンクを変換する場合

    ```
    # 対象のファイルを指定する
    npx ts-node --files src/main-parse-md-link.ts [file path]
    ```

    - div タグ、a タグから ASIN を抜き出して HTML に変換しています。
    - Markdown 側での指定方法

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

  - HTML テキスト、Markdown ファイルの Amazon リンクを一括更新する場合

    ```
    # 対象のファイルを指定する
    npx ts-node --files src/main-update-all-link.ts
    ```

  - ASIN から Amazon リンクをコンソール出力する場合

    ```
    # 引数でASINを指定する
    # カンマ区切りで複数指定可能
    npx ts-node --files src/main-print-link.ts [ASIN],[ASIN]
    ```

    - `画像リンク+タイトルリンク -> 商品アイテムリンク`の順番で出力します。

  - HTML テンプレートの CSS 設定について
    - <a href="/example/example.css">example.css</a> に CSS 設定例を記載しています。<br>必要に応じてグローバル CSS として設定してください。
