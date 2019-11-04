
import * as lib from 'src/lib';
import _ from 'lodash';

interface SettingObject {
    [key: string]: string;
}

export class File {
    private xpathSetting: SettingObject;
    private input: string;

    constructor(input: string) {
        this.input = input;
    }

    public async readXpathSetting(xpathSettingFile: string) {
        await lib.readJson(xpathSettingFile).then((content: SettingObject) => {
            this.xpathSetting = content;
        }).catch((err) => {
            console.log(err.message);
        });
    }

    public async exec() {
        lib.readJson(this.input).then((content) => {
            this.replace(content);
        }).catch((err) => {
            console.log(err.message);
        });
    }

    private replace(content: SettingObject) {
        const setting = this.getSettingForInput(content);
        _.forIn(content, (value, key) => {
        });
    }

    private getSettingForInput(content: SettingObject) {
        let setting = {};
        if (this.input in content) {
            setting = content[this.input];
        }

        return setting;
    }
}