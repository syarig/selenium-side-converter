
import * as init from 'src/command/init';
import { promises as fs } from 'fs';
import _ from 'lodash';

export class Converter {
    private inputsDir: string;
    private outputsDir: string;
    private settingsDir: string;
    private filesDir: string;

    constructor(config: object) {
        this.inputsDir = _.get(config, 'inputsDir', init.defaultInputsDir);
        this.outputsDir = _.get(config, 'outputsDir', init.defaultOutputsDir);
        this.settingsDir = _.get(config, 'settingsDir', init.defaultSettingsDir);
        this.filesDir = _.get(config, 'filesDir', init.defaultFilesDir);
    }

    private walkSideFile(sideFilesDir: string) {
        fs.readdir(this.inputsDir).then((value) => {
        });
    }

    public exec(file: string, dest: string) {
    }
}