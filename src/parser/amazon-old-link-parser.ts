import * as cheerio from "cheerio";
import { getAmazonItemInfo } from "../api/amazon-paapi";
import { AmazonParseSettings } from "../settings";

/**
 * iframeタグのsrc値からasinIdを取得
 * 設定例 => //rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&amp;bc1=000000&amp;IS2=1&amp;bg1=FFFFFF&amp;fc1=000000&amp;lc1=0000FF&amp;t=afelekibear-22&amp;language=ja_JP&amp;o=9&amp;p=8&amp;l=as4&amp;m=amazon&amp;f=ifr&amp;ref=as_ss_li_til&amp;asins=4798164283&amp;linkId=d06ee3e24f80fb7320f916aa77662abe
 * @param src
 * @returns
 */
const GetAsinIdFromIframeSrc = (src: string) => {
  if (
    src &&
    src.indexOf("amazon-adsystem.com") >= 0 &&
    src.indexOf("&asins=") >= 0
  ) {
    for (const param of src.split("&")) {
      if (param.indexOf("asins=") >= 0) {
        return param.replace("asins=", "");
      }
    }
  }
  return null;
};

/**
 * imgタグのsrc値からasinIdを取得
 * 設定例 => //ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&amp;ASIN=4798164283&amp;Format=_SL250_&amp;ID=AsinImage&amp;MarketPlace=JP&amp;ServiceVersion=20070822&amp;WS=1&amp;tag=afelekibear-22&amp;language=ja_JP
 * @param src
 * @returns
 */
const GetAsinIdFromImgSrc = (src: string) => {
  if (
    src &&
    src.indexOf("amazon-adsystem.com") >= 0 &&
    src.indexOf("&ASIN=") >= 0
  ) {
    for (const param of src.split("&")) {
      if (param.indexOf("ASIN=") >= 0) {
        return param.replace("ASIN=", "");
      }
    }
  }
  return null;
};

/**
 * HtmlText内のAmazonリンクを作り直す
 * @param htmlText
 * @returns
 */
export async function ParseOldAmazonLinkAsync(htmlText: string) {
  const $ = cheerio.load(htmlText);

  // HTMLからasinIdを抽出
  let asinIds: string[] = [];
  $("iframe").each((index: any, elem: any) => {
    // 商品画像リンク
    const asinId = GetAsinIdFromIframeSrc(elem.attribs?.src);
    if (asinId) {
      asinIds.push(asinId);
    }
  });
  $("img").each((index: any, elem: any) => {
    // 商品画像単体
    const asinId = GetAsinIdFromImgSrc(elem.attribs?.src);
    if (asinId) {
      asinIds.push(asinId);
    }
  });

  if (!asinIds || asinIds.length <= 0) {
    return htmlText;
  }

  // 重複削除
  asinIds = Array.from(new Set(asinIds));
  const itemInfoArray = await getAmazonItemInfo(asinIds);

  // 商品アイテム情報からHTMLを生成して差し替える
  $("iframe").each((index: any, elem: any) => {
    // 商品画像リンク
    const asinId = GetAsinIdFromIframeSrc(elem.attribs?.src);
    if (asinId) {
      const itemInfo = itemInfoArray.find(
        (itemInfo) => itemInfo.asinId === asinId
      );
      // pタグ - iframeタグの順で格納されている場合、親要素ごと差し替える
      const targetElement =
        $(elem.parent).prop("tagName") === "P" ? elem.parent : elem;
      if (itemInfo) {
        $(targetElement).replaceWith(
          `\n${AmazonParseSettings.CraeteAmazonItemHtmlString(itemInfo)}\n`
        );
      } else {
        $(targetElement).remove(); // 商品がなければ削除する
        console.error("remove element => " + asinId);
      }
    }
  });
  $("img").each((index: any, elem: any) => {
    // 商品画像単体
    const asinId = GetAsinIdFromImgSrc(elem.attribs?.src);
    if (asinId) {
      // srcを差し替えてidを付与する
      const itemInfo = itemInfoArray.find(
        (itemInfo) => itemInfo.asinId === asinId
      );
      if (itemInfo) {
        $(elem).replaceWith(
          `\n${AmazonParseSettings.CreateAmazonImageHtmlString(itemInfo)}\n`
        );
      }
    }
  });

  return $.html();
}

/**
 * HtmlText内のスポンサーリンクを削除する (Google広告だが...)
 * @param htmlText
 * @returns
 */
export async function RemoveOldAmazonSponserLinkAsync(htmlText: string) {
  const $ = cheerio.load(htmlText);

  // ad-areaクラスが付与されたdivタグを削除
  $("div").each((index: any, elem: any) => {
    if (elem.attribs?.class?.indexOf("ad-area") >= 0) {
      $(elem).remove();
      console.log("remove sponser link.");
    }
  });

  return $.html();
}
