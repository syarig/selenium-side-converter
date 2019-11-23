
import { SystemLogger } from 'src/logger/system_logger';
import { promises as fs } from 'fs';
import * as path from 'path';
import _ from 'lodash';
import * as util from 'src/util';

export const [
    defaultSettingsDir,
    defaultInputsDir,
    defaultOutputsDir,
    defaultFilesDir
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
const defaultSideFileExtname = '.side';

const deafultConfig = {
    sideFileExtname: defaultSideFileExtname,
    inputsDir: defaultInputsDir,
    outputsDir: defaultOutputsDir,
    filesDir: defaultFilesDir,
    xpathSettingFile: path.join(defaultSettingsDir, defaultXpathSettingFile),
    fileSettingFile: path.join(defaultSettingsDir, defaultFileSettingFile),
    textSettingFile: path.join(defaultSettingsDir, defaultTextSettingFile)
};

export class Init {
    private appPath: string

    constructor(appPath: string) {
        this.appPath = appPath;
    }

    public exec(): void {
        fs.writeFile(
            path.join(this.appPath, configFile),
            JSON.stringify(deafultConfig, null, '    ')
        );
    }
}

export class Setting {
    private setting: object;
    private settingPath: string;
    private inputsDir: string;

    public async init(config: Config): Promise<void> {
        this.inputsDir = config.get('inputsDir');
        this.setting = {
            fileSetting: await util.readJson(config.get('fileSettingFile')),
            textSetting: await util.readJson(config.get('textSettingFile')),
            xpathSetting: await util.readJson(config.get('xpathSettingFile'))
        };
    }

    public setSettingPath(inputFile: string): void {
        const absoluteInputFile = path.resolve(inputFile);
        let absoluteInputsDir = path.resolve(this.inputsDir);
        if (absoluteInputFile.indexOf(absoluteInputsDir) === -1) {
            absoluteInputsDir = path.resolve('.');
        }
        const settingPath = absoluteInputFile
            .replace(absoluteInputsDir + '/', '');

        const basename = path.basename(inputFile, path.extname(inputFile));
        this.settingPath = path.join(path.dirname(settingPath), basename).replace(new RegExp('/', 'g'), '.');
    }

    public get(key: string): object {
        const setting = _.get(this.setting, key + '.' + this.settingPath, {});
        if (!setting) {
            SystemLogger.instance.error(`"${key}" setting doesn't exists`);
        }
        return setting;
    }
}

export class Config {
    private config: object;

    public async init(args: object = {}): Promise<void> {
        this.config = deafultConfig;
        const config = await util.readJson(configFile);
        Object.assign(this.config, config);
        Object.assign(this.config, args);
    }

    public isSideFileExtname(file: string): boolean {
        return path.extname(file) === this.get('sideFileExtname');
    }

    public get(key: string): string {
        const value = _.get(this.config, key, '');
        if (value === '') {
            SystemLogger.instance.error(`"${key}" config doesn't exists`);
        }
        return value;
    }

    public getOutputFile(inputFile: string): string {
        const absoluteInputFile = path.resolve(inputFile);
        const absoluteInputsDir = path.resolve(this.get('inputsDir'));
        const index = absoluteInputFile.indexOf(absoluteInputsDir);
        const relativeInputFile = index === -1 ? inputFile : absoluteInputFile.slice(index + absoluteInputsDir.length);
        return path.join(this.get('outputsDir'), relativeInputFile);
    }
}