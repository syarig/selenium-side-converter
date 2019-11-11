
import _ from 'lodash';
import { Config } from 'src/command/init';
import fs from 'fs';
import { promises } from 'fs';
import path from 'path';

interface Walker {
    default(dirpath: string): void
    catch(e: any): void
}

async function walk(dirpath: string, walker: Walker) {
    let dirents: Array<fs.Dirent> = [];
    try {
        dirents = await promises.readdir(dirpath, { withFileTypes: true })

    } catch (e) {
        walker.default(e)
    }

    dirents.forEach((dirent: fs.Dirent) => {
        const nextDirpath = path.join(dirpath, dirent.name);
        if (dirent.isDirectory()) {
            walk(nextDirpath, walker);

        } else {
            walker.default(nextDirpath);
        }
    });
}

export class Converter {
    private config: Config

    constructor(config: Config) {
        this.config = config;
    }

    private walkSideFile(sideFilesDir: string) {
    }

    public async exec() {
        promises.readdir(this.config.get('inputsDir'), { withFileTypes: true })
    }
}