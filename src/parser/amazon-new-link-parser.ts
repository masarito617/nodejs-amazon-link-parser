import { getAmazonItemInfo } from '../api/amazon-pa.api';
import { AmazonParseSettings } from '../settings';

/**
 * ASINからコンソール出力用HTMLを作成する
 * @param htmlText
 * @returns
 */
export async function CreateAmazonPrintHtml(asinIds: string[]) {
  // ASINから商品情報を取得
  const itemInfoArray = await getAmazonItemInfo(asinIds);

  let result = '\n';

  // 商品アイテムHTMLを出力
  for (const asinId of asinIds) {
    const itemInfo = itemInfoArray.find(
      (itemInfo) => itemInfo.asinId === asinId,
    );
    if (itemInfo) {
      result += `${AmazonParseSettings.CreateAmazonImageLinkHtmlString(
        itemInfo,
      )}\n\n`;
      result += `${AmazonParseSettings.CreateAmazonImageTitleHtmlString(
        itemInfo,
      )}\n\n`;
    } else {
      console.error('not exist asinId item info => ' + asinId);
    }
  }
  result += '==============================\n\n';
  for (const asinId of asinIds) {
    const itemInfo = itemInfoArray.find(
      (itemInfo) => itemInfo.asinId === asinId,
    );
    if (itemInfo) {
      result += `${AmazonParseSettings.CraeteAmazonItemHtmlString(
        itemInfo,
      )}\n\n`;
    } else {
      console.error('not exist asinId item info => ' + asinId);
    }
  }

  return result;
}

/**
 * テキスト行内のAmazonアイテムからasinIdを取得
 * @param line
 * @returns
 */
const GetItemAsinIdFromMarkdownLine = (line: string) => {
  const match = line.match(AmazonParseSettings.AmazonItemRegax);
  if (match) {
    return match[1];
  }
};

/**
 * テキスト行内のAmazon画像リンクからasinIdを取得
 * @param line
 * @returns
 */
const GetImageLinkAsinIdFromMarkdownLine = (line: string) => {
  const match = line.match(AmazonParseSettings.AmazonImageLinkRegax);
  if (match) {
    return match[1];
  }
};

/**
 * テキスト行内のAmazon画像リンクからasinIdを取得
 * @param line
 * @returns
 */
const GetImageAsinIdFromMarkdownLine = (line: string) => {
  const match = line.match(AmazonParseSettings.AmazonImageRegax);
  if (match) {
    return match[1];
  }
};

/**
 * テキスト内のAmazonリンクを更新する
 * @param htmlText
 * @returns
 */
export async function UpdateAmazonLinkAsync(postContent: string) {
  // MarkdownテキストからasinIdを取得
  let asinIds: string[] = [];
  for (const line of postContent.split('\n')) {
    let asinId = GetItemAsinIdFromMarkdownLine(line);
    if (asinId) {
      asinIds.push(asinId);
    }
    asinId = GetImageLinkAsinIdFromMarkdownLine(line);
    if (asinId) {
      asinIds.push(asinId);
    }
  }
  if (!asinIds || asinIds.length <= 0) {
    return postContent;
  }

  // 重複削除
  asinIds = Array.from(new Set(asinIds));
  const itemInfoArray = await getAmazonItemInfo(asinIds);
  console.log(asinIds);

  // 商品アイテム情報からHTMLを生成して差し替える
  let isDoParseAmazonItem = false;
  let isDoParseAmazonImageLink = false;
  let parsePostContent = '';
  for (const line of postContent.split('\n')) {
    // 商品アイテムParse中の場合
    // 次の終了タグが来るまでの間、スキップする
    if (isDoParseAmazonItem) {
      if (line === '</div>') {
        isDoParseAmazonItem = false;
      }
      continue;
    }
    if (isDoParseAmazonImageLink) {
      if (line === '</a>') {
        isDoParseAmazonImageLink = false;
      }
      continue;
    }

    // 商品アイテムのParse
    let asinId = GetItemAsinIdFromMarkdownLine(line);
    if (asinId) {
      const itemInfo = itemInfoArray.find(
        (itemInfo) => itemInfo.asinId === asinId,
      );
      if (itemInfo) {
        parsePostContent += '\n';
        parsePostContent += `${AmazonParseSettings.CraeteAmazonItemHtmlString(
          itemInfo,
        )}`;
        isDoParseAmazonItem = true;
        continue;
      } else {
        console.error('not exist asinId item info => ' + asinId);
      }
    }

    // 商品画像リンクのParse
    asinId = GetImageLinkAsinIdFromMarkdownLine(line);
    if (asinId) {
      const itemInfo = itemInfoArray.find(
        (itemInfo) => itemInfo.asinId === asinId,
      );
      if (itemInfo) {
        parsePostContent += '\n';
        parsePostContent += `${AmazonParseSettings.CreateAmazonImageLinkHtmlString(
          itemInfo,
        )}`;
        isDoParseAmazonImageLink = true;
        continue;
      } else {
        console.error('not exist asinId item info => ' + asinId);
      }
    }

    // 商品リンクのParse
    asinId = GetImageAsinIdFromMarkdownLine(line);
    if (asinId) {
      const itemInfo = itemInfoArray.find(
        (itemInfo) => itemInfo.asinId === asinId,
      );
      if (itemInfo) {
        parsePostContent += '\n';
        parsePostContent += `${AmazonParseSettings.CreateAmazonImageHtmlString(
          itemInfo,
        )}`;
        continue;
      } else {
        console.error('not exist asinId item info => ' + asinId);
      }
    }

    // 上記以外の場合、元の行をそのまま追加
    if (parsePostContent != '') {
      parsePostContent += '\n';
    }
    parsePostContent += line;
  }
  return parsePostContent;
}
