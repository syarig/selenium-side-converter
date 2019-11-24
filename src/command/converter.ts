
import { Setting } from 'src/command/init';
import { File } from 'src/template/file';
import { Xpath } from 'src/template/xpath';
import { Text } from 'src/template/text';
import { Command, Replaceable } from 'src/template/side';
import { promises as fs } from 'fs';
import * as util from 'src/util';
import _ from 'lodash';

const keyTests = 'tests';
const keyCommands = 'commands';

export class Converter {
    private input: object;
    private replaceFile: Function;
    private replaceText: Function;
    private replaceXpath: Function;

    public async init(inputFile: string, setting: Setting): Promise<Converter> {
        this.input = await util.readJson(inputFile);
        const getSetting = _.curry(this.getSetting)(inputFile)(setting);
        this.setReplaceFile(getSetting('fileSetting'));
        this.setReplaceText(getSetting('textSetting'));
        this.setReplaceXpath(getSetting('xpathSetting'));
        return this;
    }

    private getSetting(inputFile: string, setting: Setting, name: string): object {
        const settingPath = [name, setting.getSettingPath(inputFile)].join('.');
        const templateSettings = setting.get(settingPath);

        const splitted = settingPath.split('.');
        _.times(splitted.length, (num) => {
            const newSettingPath = splitted.slice(0, splitted.length - num).join('.');
            this.mergeSetting(templateSettings, setting.get(newSettingPath));
        });

        return templateSettings;
    }

    private mergeSetting(dist: object, src: object): void {
        _.forEach(src, (value: string | object, key: string) => {
            if (_.isPlainObject(value)) {
                return;
            }

            _.set(dist, key, value);
        });
    }

    private setReplaceFile(setting: object): void {
        this.replaceFile = this.replace(new File(setting));
    }

    private setReplaceText(setting: object): void {
        this.replaceText = this.replace(new Text(setting));
    }

    private setReplaceXpath(setting: object): void {
        this.replaceXpath = this.replace(new Xpath(setting));
    }

    public exec(): void {
        const tests = _.get(this.input, keyTests, []);
        _.forEach(tests, (test) => {
            const commands = _.get(test, keyCommands, []);
            this.execCommands(commands);
        });
    }

    public save(output: string): void {
        fs.writeFile(output, JSON.stringify(this.input, null, '    '));
    }

    private execCommands(commands: object): void {
        _.forEach(commands, (command: Command) => {
            command.target = this.replaceXpath(command.target);
            command.target = this.replaceFile(command.target);
            command.target = this.replaceText(command.target);

            command.value = this.replaceFile(command.value);
            command.value = this.replaceXpath(command.value);
            command.value = this.replaceText(command.value);
        });
    }

    private replace(replaceable: Replaceable): (target: string) => string {
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
            });
            return replaced;
        };
    }
}
