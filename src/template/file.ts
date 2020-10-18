import path from 'path';
import {Replaceable} from 'src/template/sideFile';

export class File implements Replaceable {
  private fileSetting: object;
  private filesDir: string;

  constructor(fileSettingFile: object, filesDir: string) {
    this.fileSetting = fileSettingFile;
    this.filesDir = filesDir;
  }

  public getSettings(): object {
    return this.fileSetting;
  }

  public convSetting(setting: string): string {
    return path.resolve(path.join(this.filesDir, setting));
  }

  public getTemplate(key: string): string {
    return `{file:${key}}`;
  }
}