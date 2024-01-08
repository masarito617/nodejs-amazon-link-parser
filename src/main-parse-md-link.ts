import { FileUtil } from './common/FileUtil';
import { UpdateAmazonLinkAsync } from './parser/amazon-new-link-parser';

/**
 * Markdownファイル内のAmazonリンク更新する
 * @param fileDir
 * @param fileName
 */
async function ParseAsync(filePath: string) {
  // ファイル読み込み
  const postContent = FileUtil.tryReadFileSync(filePath);
  if (!postContent) {
    console.error('not exist file path => ' + filePath);
    return;
  }

  // Amazonリンクを更新する
  const convertPostContent = await UpdateAmazonLinkAsync(postContent);

  // 変更した内容を書き込む
  FileUtil.writeFileSync(filePath, convertPostContent);
}

async function MainAsync() {
  const argv = process.argv;
  if (argv.length <= 2) {
    console.error('prease input post markdown file path.');
    return;
  }

  // 引数からファイルパスを取得して読み込む
  const paramPostFilePath = argv[2];
  ParseAsync(paramPostFilePath);
}
MainAsync();
