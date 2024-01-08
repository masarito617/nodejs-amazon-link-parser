import path from 'path';
import { FileUtil } from './common/FileUtil';
import { UpdateAmazonLinkAsync } from './parser/amazon-new-link-parser';
import { FileSettings } from './settings';

/**
 * 全てのHTMLテキスト記事、Markdown記事のAmazonリンクを最新情報に更新する
 * @param fileDir
 * @param fileName
 */
async function ParseAsync(fileDir: string, fileName: string) {
  // ファイル読み込み
  const readPath = path.join(fileDir, fileName);
  const postContent = FileUtil.tryReadFileSync(readPath);

  // Amazonリンクを変換する
  const convertPostContent = await UpdateAmazonLinkAsync(postContent);

  // 変更した内容を書き込む
  FileUtil.writeFileSync(readPath, convertPostContent);
}

async function MainAsync() {
  // HTMLテキストファイルの変換
  const postTextFilePathList = FileUtil.readDirSync(
    FileSettings.PostTextFileDir,
  );
  for (const postTextFile of postTextFilePathList) {
    console.log('\n[' + postTextFile + ']');
    await ParseAsync(FileSettings.PostTextFileDir, postTextFile);
  }

  // Markdownファイルの変換
  const postMarkdownFilePathList = FileUtil.readDirSync(
    FileSettings.PostMarkdownFileDir,
  );
  for (const postMarkdownFile of postMarkdownFilePathList) {
    console.log('\n[' + postMarkdownFile + ']');
    await ParseAsync(FileSettings.PostMarkdownFileDir, postMarkdownFile);
  }
}
MainAsync();
