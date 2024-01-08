import { amazonPaApiResponse } from "./type/amazon-pa-api";

/**
 * ファイルパス関連
 */
export namespace FileSettings {
  /**
   * 記事テキストファイルの格納パス
   */
  export const PostTextFileDir = "【記事テキストファイルの格納パス】";

  /**
   * 記事マークダウンファイルの格納パス
   */
  export const PostMarkdownFileDir = "【記事マークダウンファイルの格納パス】";
}

/**
 * Amazon Product Advertising API 設定
 */
export namespace AmazonPaApiSettings {
  /**
   * パートナータグ
   */
  export const AmazonPaApiPartnerTag =
    "【Amazon Product Advertising API パートナータグ】";

  /**
   * アクセスキー
   */
  export const AmazonPaApiAccessKey =
    "【Amazon Product Advertising API アクセスキー】";

  /**
   * シークレットキー
   */
  export const AmazonPaApiSecretKey =
    "【Amazon Product Advertising API シークレットキー】";

  /**
   * API実行時の待ち時間
   * 実行エラーが多発するようであれば大きくすれば改善するかも
   */
  export const WaitExecuteApiMs = 1000;
}

/**
 * AmazonアイテムHTML変換設定
 */
export namespace AmazonParseSettings {
  /**
   * 商品アイテム
   */
  export const AmazonItemDataId = "data-asin-id";
  export const AmazonItemRegax = /data-asin-id="(.+)">/;
  export function CraeteAmazonItemHtmlString(
    item: amazonPaApiResponse.Item
  ): string {
    return `<div class="amazon-pa-api-item" ${
      AmazonParseSettings.AmazonItemDataId
    }="${item.asinId}">
    <div class="amazon-logo-img-wrapper">
        <img class="amazon-logo-img" src="/img/amazon/amazon-logo.png">
    </div>
    <a class="amazon-pa-api-item-link" href="${item.pageUrl}" target="_blank">
        <div class="amazon-pa-api-item-img-wrapper">
            <img class="amazon-pa-api-item-img" src="${item.imageUrl}">
        </div>
        <div class="amazon-pa-api-item-text-area">
            <div class="amazon-pa-api-item-text-title">${SubStringTitle(
              item.displayTitle
            )}</div>
            <div class="amazon-pa-api-item-text-price">${
              item.displayPrice ? SubStringPrice(item.displayPrice) : ""
            }</div>
        </div>
    </a>
</div>`;
  }

  /**
   * 商品画像リンク
   */
  export const AmazonImageLinkDataId = "data-img-link-asin-id";
  export const AmazonImageLinkRegax = /data-img-link-asin-id="(.+)">/;
  export function CreateAmazonImageLinkHtmlString(
    item: amazonPaApiResponse.Item
  ): string {
    return `<a href="${item.pageUrl}" target="_blank" rel="noopener" ${AmazonParseSettings.AmazonImageLinkDataId}="${item.asinId}">
  <img class="amazon-pa-api-img" ${AmazonParseSettings.AmazonImageDataId}="${item.asinId}" src="${item.imageUrl}" decoding="async">
</a>`;
  }

  /**
   * 商品画像
   */
  export const AmazonImageDataId = "data-img-asin-id";
  export const AmazonImageRegax = /data-img-asin-id="(.+)">/;
  export function CreateAmazonImageHtmlString(
    item: amazonPaApiResponse.Item
  ): string {
    return `<img class="amazon-pa-api-img" src="${item.imageUrl}" decoding="async" border="0" ${AmazonParseSettings.AmazonImageDataId}="${item.asinId}">`;
  }

  /**
   * 商品タイトル
   */
  export function CreateAmazonImageTitleHtmlString(
    item: amazonPaApiResponse.Item
  ): string {
    return `<a href="${item.pageUrl}">${SubStringTitle(item.displayTitle)}</a>`;
  }

  /**
   * テキストの最大表示文字数
   */
  const MaxDisplayTitleCount = 40;
  const SubStringTitle = (value: string) => {
    if (value?.length <= MaxDisplayTitleCount) {
      return value;
    }
    return value.substring(0, MaxDisplayTitleCount) + "...";
  };
  const SubStringPrice = (value: string) => {
    if (!value.includes(" (")) {
      return value;
    }
    return value.split(" (")[0];
  };
}
