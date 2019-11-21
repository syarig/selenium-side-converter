
import _ from 'lodash';
import { Replaceable } from 'src/template/side';

export class Xpath implements Replaceable {
    private fileSetting: object;

    constructor(fileSettingFile: object) {
        this.fileSetting = fileSettingFile;
    }

    public getSettings() {
        return this.fileSetting;
    }

    public convSetting(setting: string): string {
        return `xpath=${setting}`;
    }

    public getTemplate(key: string) {
        return `\{xpath:${key}\}`;
    }
}