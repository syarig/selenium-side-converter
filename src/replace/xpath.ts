
import _ from 'lodash';

export class Xpath {
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