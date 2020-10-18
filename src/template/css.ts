import {Replaceable} from 'src/template/sideFile';

export class Css implements Replaceable {
  private cssSetting: object;

  constructor(cssSettingFile: object) {
    this.cssSetting = cssSettingFile;
  }

  public getSettings(): object {
    return this.cssSetting;
  }

  public convSetting(setting: string): string {
    return `css=${setting}`;
  }

  public getTemplate(key: string): string {
    return `{css:${key}}`;
  }
}