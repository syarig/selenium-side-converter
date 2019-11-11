
import { promises as fs } from 'fs';
import { join } from 'path';
import _ from 'lodash';
import * as util from 'src/util';

export const [
    defaultSettingsDir,
    defaultInputsDir,
    defaultOutputsDir,
    defaultFilesDir,
] = ['settings', 'inputs', 'outputs', 'files'];

export const makeDirs = [
    defaultInputsDir,
    defaultOutputsDir,
    defaultFilesDir
];

export const [
    defaultXpathSettingFile,
    defaultFileSettingFile,
    defaultTextSettingFile
] = ['xpath.json', 'file.json', 'text.json'];


export const settingFiles = [
    defaultXpathSettingFile,
    defaultFileSettingFile,
    defaultTextSettingFile
];

export const configFile = 'ssconfig.json';

const deafultConfig = {
    inputsDir: defaultInputsDir,
    outputsDir: defaultOutputsDir,
    filesDir: defaultFilesDir,
    xpathSettingFile: join(defaultSettingsDir, defaultXpathSettingFile),
    fileSettingFile: join(defaultSettingsDir, defaultFileSettingFile),
    textSettingFile: join(defaultSettingsDir, defaultTextSettingFile)
}

export class Init {
    public exec() {
        fs.writeFile(configFile, JSON.stringify(deafultConfig, null, '    '))
    }
}

export class Config {
    private config: object;

    public async init(args: object = {}) {
        this.config = deafultConfig;
        let config = await util.readJson(configFile)
        Object.assign(this.config, config);
        Object.assign(this.config, args);
    }

    public get(key: string) {
        const value = _.get(this.config, key, '');
        if (value === '') {
            console.log(`"${key}" config doesn't exists`);
        }
        return value;
    }
}