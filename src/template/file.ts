
import _ from 'lodash';
import path from 'path';
import { Replaceable } from 'src/template/side';

export class File implements Replaceable {
    private fileSetting: object;

    constructor(fileSettingFile: object) {
        this.fileSetting = fileSettingFile;
    }

    public getSettings() {
        return this.fileSetting;
    }

    public convSetting(setting: string): string {
        return path.resolve(setting);
    }

    public getTemplate(key: string) {
        return `{file:${key}}`;
    }
}