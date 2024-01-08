import { CreateAmazonPrintHtml } from './parser/amazon-new-link-parser';

/**
 * 指定されたASIDのAmazonリンクをコンソール出力する
 * @param asinIdArray
 */
async function PrintLinkAsync(asinIdArray: string[]) {
  const amazonHtml = await CreateAmazonPrintHtml(asinIdArray);
  console.log(amazonHtml);
}

async function MainAsync() {
  const argv = process.argv;
  if (argv.length <= 2) {
    console.error('prease input ASIN IDs (「,」split).');
    return;
  }

  // 引数からファイルパスを取得して読み込む
  const paramAsinIds = argv[2];
  const asinIdArray = paramAsinIds.split(',');
  PrintLinkAsync(asinIdArray);
}
MainAsync();
