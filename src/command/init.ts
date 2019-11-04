
import { promises as fs } from 'fs';
import { join } from 'path';

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

const [
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

export class Init {
    public exec() {
        const config = this.getConfig();
        fs.writeFile(configFile, JSON.stringify(config, null, '    '))
    }

    private getConfig() {
        return {
            inputsDir: defaultInputsDir,
            outputsDir: defaultOutputsDir,
            filesDir: defaultFilesDir,
            xpathSettingFile: join(defaultSettingsDir, defaultXpathSettingFile),
            fileSettingFile: join(defaultSettingsDir, defaultFileSettingFile),
            textSettingFile: join(defaultSettingsDir, defaultTextSettingFile)
        };
    }
}