
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
    private _config: object;

    public async init() {
        let config = await util.readJson(configFile)
        if (_.isEmpty(config)) {
            this._config = deafultConfig;
            return;
        }

        this._config = config;
    }

    get config() {
        return this._config;
    }
}