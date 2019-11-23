
import { Replaceable } from 'src/template/side';

export class Text implements Replaceable {
    private fileSetting: object;

    constructor(fileSettingFile: object) {
        this.fileSetting = fileSettingFile;
    }

    public getSettings(): object {
        return this.fileSetting;
    }

    public convSetting(setting: string): string {
        return setting; 
    }

    public getTemplate(key: string): string {
        return `{file:${key}}`;
    }
}