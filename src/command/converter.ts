
import * as create from 'src/command/create';
import { Convert } from 'src/command/convert';
import { promises as fs } from 'fs';

export class Converter {
    private converter: Convert;
    private _inputsDir: string = create.defaultInputsDir;
    private _outputsDir: string = create.defaultOutputsDir;
    private _settingsDir: string = create.defaultSettingsDir;
    private _filesDir: string = create.defaultFilesDir;

    constructor(converter: Convert) {
        this.converter = converter;
    }

    set inputsDir(s: string) {
        this._inputsDir = s;
    }

    set outputsDir(s: string) {
        this._outputsDir = s;
    }

    set settingsDir(s: string) {
        this._settingsDir = s;
    }

    set filesDir(s: string) {
        this._filesDir = s;
    }

    private walkSideFile(sideFilesDir: string) {
        fs.readdir(sideFilesDir).then((value) => {
            console.log(value);
        });
    }

    public exec(file: string, dest: string) {
        this.walkSideFile(this._inputsDir);
    }
}