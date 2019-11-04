

import { promises as fs } from 'fs';
import { join } from 'path';
import * as init from 'src/command/init';
import _ from 'lodash';



export class Create {
    private appPath: string;

    constructor(appPath: string) {
        this.appPath = appPath;
    }

    public exec() {
        init.makeDirs.forEach((dir) => { this.mkdir(dir) });
        this.createSettings();
    }

    private async createSettings() {
        await this.mkdir(init.defaultSettingsDir)
        init.settingFiles.forEach((file) => { this.touch(join(init.defaultSettingsDir, file)) });
    }

    private mkdir(dir: string) {
        const path = join(this.appPath, dir);
        return fs.mkdir(path, { recursive: true });
    }

    private async touch(file: string) {
        file = join(this.appPath, file);
        const handler: fs.FileHandle = await fs.open(file, 'w')
        handler.close();
    }
}