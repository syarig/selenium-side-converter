
import * as init from 'src/command/init';
import { promises as fs } from 'fs';
import _ from 'lodash';

export class Converter {
    private config: object

    constructor(config: object) {
        this.config = config;
    }

    private walkSideFile(sideFilesDir: string) {
    }

    public exec(file: string, dest: string) {
    }
}