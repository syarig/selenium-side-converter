
import { Setting } from 'src/command/init';
import { File } from 'src/template/file';
import { Xpath } from 'src/template/xpath';
import { Text } from 'src/template/text';
import { Css } from 'src/template/css';
import { Command, Replaceable, SideFile } from 'src/template/sideFile';
import { promises as fs } from 'fs';
import * as util from 'src/util';
import _ from 'lodash';

const keyTests = 'tests';
const keyCommands = 'commands';

export class Converter {
    private input: SideFile;
    private replaceFile: (target: string) => string;
    private replaceText: (target: string) => string;
    private replaceXpath: (target: string) => string;
    private replaceCss: (target: string) => string;

    public async init(inputFile: string, filesDir: string, setting: Setting): Promise<Converter> {
        this.input = await util.readJson(inputFile) as SideFile;
        const getSetting = this.getSettingFn(inputFile, setting);
        this.replaceFile = this.replace(new File(getSetting('fileSetting'), filesDir));
        this.replaceText = this.replace(new Text(getSetting('textSetting')));
        this.replaceXpath = this.replace(new Xpath(getSetting('xpathSetting')));
        this.replaceCss = this.replace(new Css(getSetting('cssSetting')));
        return this;
    }

    private getSettingFn(inputFile: string, setting: Setting): (name: string) => object {
        return (name: string): object => {
            const settingPath = [name, setting.getSettingPath(inputFile)].join('.');
            const templateSettings = setting.get(settingPath);

            const splitted = settingPath.split('.');
            _.times(splitted.length, (num) => {
                const newSettingPath = splitted.slice(0, splitted.length - num).join('.');
                this.mergeSetting(templateSettings, setting.get(newSettingPath));
            });

            return templateSettings;
        };
    }

    private mergeSetting(dist: object, src: object): void {
        _.forEach(src, (value: string | object, key: string) => {
            if (_.isPlainObject(value) || _.has(dist, key)) {
                return;
            }

            _.set(dist, key, value);
        });
    }

    public exec(): void {
        this.input.url = this.replaceText(this.input.url);
        const tests = _.get(this.input, keyTests, []);
        _.forEach(tests, (test) => {
            const commands = _.get(test, keyCommands, []);
            this.execCommands(commands);
        });
    }

    public save(output: string): Promise<void> {
        return fs.writeFile(output, JSON.stringify(this.input, null, '    '));
    }

    private execCommands(commands: object): void {
        _.forEach(commands, (command: Command) => {
            command.target = this.replaceXpath(command.target);
            command.target = this.replaceFile(command.target);
            command.target = this.replaceText(command.target);
            command.target = this.replaceCss(command.target);

            command.value = this.replaceXpath(command.value);
            command.value = this.replaceFile(command.value);
            command.value = this.replaceText(command.value);
            command.value = this.replaceCss(command.value);
        });
    }

    private replace(replaceable: Replaceable): (target: string) => string {
        return (target: string): string => {
            if (!target) {
                return target;
            }

            _.forEach(replaceable.getSettings(), (setting: string, key: string) => {
                const template = replaceable.getTemplate(key);
                if (target.indexOf(template) === -1) {
                    return;
                }

                target = target.replace(new RegExp(template, 'g'), replaceable.convSetting(setting));
            });
            return target;
        };
    }
}
