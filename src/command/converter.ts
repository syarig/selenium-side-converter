
import { Setting } from '@/command/init';
import { File } from '@/template/file';
import { Xpath } from '@/template/xpath';
import { Text } from '@/template/text';
import { Command, Replaceable } from '@/template/side';
import { promises as fs } from 'fs';
import * as util from '@/util';
import _ from 'lodash';

const keyTests = 'tests';
const keyCommands = 'commands';

export class Converter {
    private input: object;
    private replaceFile: Function;
    private replaceText: Function;
    private replaceXpath: Function;

    public async init(inputFile: string, setting: Setting) {
        setting.setSettingPath(inputFile);
        this.input = await util.readJson(inputFile);
        this.setReplaceFile(setting.get('fileSetting'));
        this.setReplaceText(setting.get('textSetting'));
        this.setReplaceXpath(setting.get('xpathSetting'));
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
}
