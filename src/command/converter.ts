
import { File } from 'src/replace/file';
import { Xpath } from 'src/replace/xpath';
import { Text } from 'src/replace/text';
import { Replace, Command } from 'src/replace/side';
import { promises as fs } from 'fs';
import * as lib from 'src/util';
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

    public async init(input: string, config: object) {
        this.inputFile = input;
        this.setInput(input);
        await this.setReplaceFile(config);
        await this.setReplaceText(config);
        await this.setReplaceXpath(config);
        console.log('ready to load settings.');
    }

    private async setReplaceFile(config: object) {
        const settingFile = _.get(config, 'fileSettingFile');
        const setting = this.getSettingByInput(await lib.readJson(settingFile))
        this.replaceFile = this.replace(new File(setting));
    }

    private async setReplaceText(config: object) {
        const settingFile = _.get(config, 'textSettingFile');
        const setting = this.getSettingByInput(await lib.readJson(settingFile))
        this.replaceText = this.replace(new Text(setting));
    }

    private async setReplaceXpath(config: object) {
        const settingFile = _.get(config, 'xpathSettingFile');
        const setting = this.getSettingByInput(await lib.readJson(settingFile))
        this.replaceXpath = this.replace(new Xpath(setting));
    }

    private async setInput(input: string) {
        this.input = await lib.readJson(input);
    }

    public exec() {
        const tests = _.get(this.input, keyTests, []);
        _.forEach(tests, (test) => {
            const commands = _.get(test, keyCommands, [])
            this.execCommands(commands);
        });
    }

    public save(output: string) {
        fs.writeFile(output, JSON.stringify(this.input, null, '    '))
        console.log('outputs');
    }

    private execCommands(commands: object) {
        _.forEach(commands, (command) => {
            this.replaceCommand(command);
        });
    }

    private replaceCommand(command: Command) {
        command.target = this.replaceXpath(command.target);
        command.value = this.replaceXpath(command.value);

        command.target = this.replaceFile(command.target);
        command.value = this.replaceFile(command.value);

        command.target = this.replaceText(command.target);
        command.value = this.replaceText(command.value);
    }

    private replace(replace: Replace) {
        return (target: string): string => {
            if (!target) {
                return target;
            }

            let replaced = target;
            _.forEach(replace.getSettings(), (setting, key) => {
                const template = replace.getTemplate(key);
                if (target.indexOf(template) === -1) {
                    return;
                }

                replaced = target.replace(new RegExp(template, 'g'), replace.convSetting(setting));
            })
            return replaced;
        }
    }

    private getSettingByInput(settings: object) {
        const basename = path.basename(this.inputFile, path.extname(this.inputFile));
        return _.get(settings, basename, {});
    }
}
