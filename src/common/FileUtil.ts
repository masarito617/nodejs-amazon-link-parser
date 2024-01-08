import fs from 'fs';

export class FileUtil {
  /**
   * ファイル読込処理
   * 読み込めなければ空文字を返す
   * @param filePath
   * @returns
   */
  public static tryReadFileSync(filePath: string): string {
    let result: string = '';
    try {
      result = fs.readFileSync(filePath, 'utf-8');
    } catch {
      result = '';
    }
    return result;
  }

  /**
   * ファイル書込処理
   * @param filePath
   * @param value
   */
  public static writeFileSync(filePath: string, value: string) {
    fs.writeFileSync(filePath, value, 'utf8');
  }

  /**
   * フォルダ内のファイル一覧読込
   * @param fileDir
   * @returns
   */
  public static readDirSync(fileDir: string): string[] {
    const allDirents = fs.readdirSync(fileDir, { withFileTypes: true });
    return allDirents
      .filter((dirent) => dirent.isFile())
      .map(({ name }) => name);
  }
}
