
import _ from 'lodash';

export class Text {
    private fileSetting: object;

    constructor(fileSettingFile: object) {
        this.fileSetting = fileSettingFile;
    }

    public getSettings() {
        return this.fileSetting;
    }

    public convSetting(setting: string) {
        return setting; 
    }

    public getTemplate(key: string) {
        return `\{file:${key}\}`;
    }
}