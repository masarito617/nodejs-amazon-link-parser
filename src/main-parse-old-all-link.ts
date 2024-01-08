import path from 'path';
import { FileUtil } from './common/FileUtil';
import { ParseOldAmazonLinkAsync } from './parser/amazon-old-link-parser';
import { FileSettings } from './settings';

/**
 * HTMLテキスト記事の古いAmazonリンク(iframe、img)を独自のHTML形式に変換する
 * @param fileDir
 * @param fileName
 */
async function ParseAsync(fileDir: string, fileName: string) {
  // ファイル読み込み
  const readPath = path.join(fileDir, fileName);
  const postContent = FileUtil.tryReadFileSync(readPath);

  // Amazonリンクを変換する
  const convertPostContent = await ParseOldAmazonLinkAsync(postContent);

  // 変更した内容を書き込む
  FileUtil.writeFileSync(readPath, convertPostContent);
}

async function MainAsync() {
  // HTMLテキストフォルダ内の全てのファイルに対して行う
  const postTextFilePathList = FileUtil.readDirSync(
    FileSettings.PostTextFileDir,
  );
  for (const postTextFile of postTextFilePathList) {
    console.log('\n[' + postTextFile + ']');
    await ParseAsync(FileSettings.PostTextFileDir, postTextFile);
  }
}
MainAsync();
