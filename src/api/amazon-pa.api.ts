import ProductAdvertisingAPIv1 from 'paapi5-nodejs-sdk';
import { AmazonPaApiSettings } from '../settings';
import { amazonPaApiData, amazonPaApiResponse } from '../type/amazon-pa-api';

/**
 * GetItemsAPI実行
 * awaitできるようにPromiseでラップして定義
 * @param request
 * @returns
 */
async function requestGetItems(
  request: any,
): Promise<amazonPaApiData.getItems | undefined> {
  // ビルド時に大量アクセスとなるのを防ぐため少し待つ
  await new Promise((resolve) =>
    setTimeout(resolve, AmazonPaApiSettings.WaitExecuteApiMs),
  );

  // リクエスト実行
  return new Promise((resolve) => {
    const api = new ProductAdvertisingAPIv1.DefaultApi();
    api.getItems(request, (error: any, data: any, response: any) => {
      // 取得エラー時
      if (error) {
        // console.log(error);
        resolve(undefined);
        return;
      }

      // レスポンス取得
      const responseJson: amazonPaApiData.getItems =
        ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);
      resolve(responseJson);
    });
  });
}

/**
 * Amazon商品アイテム情報を取得
 * @param asidIds
 * @param callback
 * @returns
 */
export async function getAmazonItemInfo(
  asidIds: string[],
): Promise<amazonPaApiResponse.Item[]> {
  const resultItems: amazonPaApiResponse.Item[] = [];

  // 設定値を取得
  const partnerTag = AmazonPaApiSettings.AmazonPaApiPartnerTag;
  const accessKey = AmazonPaApiSettings.AmazonPaApiAccessKey;
  const secretKey = AmazonPaApiSettings.AmazonPaApiSecretKey;
  if (!partnerTag || !accessKey || !secretKey) {
    console.error(`not found amazon paapi!! => ${asidIds}`);
    return resultItems;
  }

  const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
  const getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();

  defaultClient.accessKey = accessKey;
  defaultClient.secretKey = secretKey;
  defaultClient.host = 'webservices.amazon.co.jp';
  defaultClient.region = 'us-west-2';

  getItemsRequest['PartnerTag'] = partnerTag;
  getItemsRequest['PartnerType'] = 'Associates';

  // 取得したい製品情報を指定
  getItemsRequest['ItemIds'] = asidIds;
  getItemsRequest['Resources'] = [
    'ItemInfo.Title',
    'Images.Primary.Large',
    'Offers.Listings.Price',
  ];

  // リクエスト実行
  const responseJson = await requestGetItems(getItemsRequest);
  if (!responseJson) {
    console.error(`error response amazon paapi!! => ${asidIds}`);
    return resultItems;
  }
  const responseItems = responseJson.ItemsResult?.Items;
  if (!Array.isArray(responseItems) || responseItems.length <= 0) {
    console.error(`no response amazon paapi!! => ${asidIds}`);
    return resultItems;
  }

  console.error(`success amazon paapi!! => ${asidIds}`);

  // レスポンス形式に変換して返却
  for (const responseItem of responseItems) {
    resultItems.push({
      asinId: responseItem.ASIN,
      pageUrl: responseItem.DetailPageURL,
      imageUrl: responseItem.Images?.Primary?.Large?.URL,
      displayPrice: responseItem.Offers?.Listings[0]?.Price?.DisplayAmount,
      displayTitle: responseItem.ItemInfo?.Title?.DisplayValue,
    });
  }
  return resultItems;
}
