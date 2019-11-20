
import { Config } from '@/command/init';
import { File } from '@/template/file';
import { Xpath } from '@/template/xpath';
import { Text } from '@/template/text';
import { Command, Replaceable } from '@/template/side';
import { promises as fs } from 'fs';
import * as util from '@/util';
import _ from 'lodash';
import * as path from 'path';

const keyTests = 'tests';
const keyCommands = 'commands';

export class Converter {
    private input: object;
    private inputFile: string;
    private replaceFile: Function;
    private replaceText: Function;
    private replaceXpath: Function;

    public async init(input: string, config: Config) {
        const getSettings: (arg: object) => object = _.curry(this.getSettingsByInput)(config.get('inputsDir'), input);
        const fileSettingFile = await util.readJson(config.get('fileSettingFile'));
        const textSettingFile = await util.readJson(config.get('textSettingFile'));
        const xpathSettingFile = await util.readJson(config.get('xpathSettingFile'));

        this.inputFile = input;
        this.input = await util.readJson(input);
        this.setReplaceFile(getSettings(fileSettingFile));
        this.setReplaceText(getSettings(textSettingFile));
        this.setReplaceXpath(getSettings(xpathSettingFile));
    }

    private setReplaceFile(setting: object) {
        this.replaceFile = this.replace(new File(setting));
    }

    private setReplaceText(setting: object) {
        this.replaceText = this.replace(new Text(setting));
    }

    private setReplaceXpath(setting: object) {
        this.replaceXpath = this.replace(new Xpath(setting));
    }

    public exec() {
        const tests = _.get(this.input, keyTests, []);
        _.forEach(tests, (test) => {
            const commands = _.get(test, keyCommands, [])
            this.execCommands(commands);
        });
    }

    public save(output: string) {
        fs.writeFile(output, JSON.stringify(this.input, null, '    '));
    }

    private execCommands(commands: object) {
        _.forEach(commands, (command: Command) => {
            command.target = this.replaceXpath(command.target);
            command.target = this.replaceFile(command.target);
            command.target = this.replaceText(command.target);

            command.value = this.replaceFile(command.value);
            command.value = this.replaceXpath(command.value);
            command.value = this.replaceText(command.value);
        });
    }

    private replace(replaceable: Replaceable) {
        return (target: string): string => {
            if (!target) {
                return target;
            }

            let replaced = target;
            _.forEach(replaceable.getSettings(), (setting: string, key: string) => {
                const template = replaceable.getTemplate(key);
                if (target.indexOf(template) === -1) {
                    return;
                }

                replaced = target.replace(new RegExp(template, 'g'), replaceable.convSetting(setting));
            })
            return replaced;
        }
    }

    private getSettingsByInput(inputsDir: string, inputFile: string, settings: object) {
        const absoluteInputFile = path.resolve(inputFile);
        let absoluteInputsDir = path.resolve(inputsDir);
        if (absoluteInputFile.indexOf(absoluteInputsDir) === -1) {
            absoluteInputsDir = path.resolve('.');
        }
        let settingPath = absoluteInputFile
            .replace(absoluteInputsDir + '/', '')

        const basename = path.basename(inputFile, path.extname(inputFile));
        settingPath = path.join(path.dirname(settingPath), basename).replace(new RegExp('/', 'g'), '.');

        return _.get(settings, settingPath, {});
    }
}
