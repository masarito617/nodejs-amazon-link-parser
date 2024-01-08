/**
 * paapi5から返却されるレスポンス
 */
export namespace amazonPaApiData {
    // GetItems
    // https://webservices.amazon.com/paapi5/documentation/get-items.html
    export type getItems = {
      ItemsResult: ItemsResult;
    };
  
    type ItemsResult = {
      Items: Item[];
    };
    type Item = {
      ASIN: string;
      DetailPageURL: string;
      Images: ItemImages;
      ItemInfo: ItemInfo;
      Offers: Offers;
    };
  
    // 画像情報
    type ItemImages = {
      Primary: ItemImagesPrimary;
    };
    type ItemImagesPrimary = {
      Large: ItemImagePrimaryLarge;
    };
    type ItemImagePrimaryLarge = {
      URL: string;
      Height: 500;
      Width: 396;
    };
  
    // タイトル情報
    type ItemInfo = {
      Title: ItemInfoTitle;
    };
    type ItemInfoTitle = {
      DisplayValue: string;
      Label: string;
      Locale: string;
    };
  
    // 価格等の情報
    type Offers = {
      Listings: OfferListItem[];
    };
    type OfferListItem = {
      Id: string;
      Price: OfferListItemPrice;
      ViolatesMAP: boolean;
    };
    type OfferListItemPrice = {
      Amount: number;
      Currency: string;
      DisplayAmount: string;
    };
  }
  
  /**
   * アプリケーション側で受け取るレスポンス形式
   */
  export namespace amazonPaApiResponse {
    export type Item = {
      asinId: string;
      pageUrl: string;
      imageUrl: string;
      displayPrice: string;
      displayTitle: string;
    };
  }
  