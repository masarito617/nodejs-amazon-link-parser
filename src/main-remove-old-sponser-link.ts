import path from 'path';
import { FileUtil } from './common/FileUtil';
import {
  ParseOldAmazonLinkAsync,
  RemoveOldAmazonSponserLinkAsync,
} from './parser/amazon-old-link-parser';
import { FileSettings } from './settings';

/**
 * HTMLテキスト記事の古いAmazonリンク(iframe、img)を独自のHTML形式に変換する
 * @param fileDir
 * @param fileName
 */
async function RemoveAsync(fileDir: string, fileName: string) {
  // ファイル読み込み
  const readPath = path.join(fileDir, fileName);
  const postContent = FileUtil.tryReadFileSync(readPath);

  // スポンサーリンクを削除する
  const convertPostContent = await RemoveOldAmazonSponserLinkAsync(postContent);

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
    await RemoveAsync(FileSettings.PostTextFileDir, postTextFile);
  }
}
MainAsync();
