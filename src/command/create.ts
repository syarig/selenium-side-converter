import {promises as fs} from 'fs';
import * as path from 'path';
import * as init from 'src/command/init';


export class Create {
  private appPath: string;

  constructor(appPath: string) {
    this.appPath = appPath;
  }

  public async exec(): Promise<void> {
    await Promise.all(init.makeDirs.map((dir) => { this.mkdir(dir); }));
    await this.createSettings();
    const initInstance = new init.Init(this.appPath);
    initInstance.exec();
  }

  private async createSettings(): Promise<void> {
    await this.mkdir(init.defaultSettingsDir);
    init.settingFiles.forEach((file) => {
      this.touch(file);
    });
  }

  private mkdir(dir: string): Promise<void> {
    const dirpath = path.join(this.appPath, dir);
    return fs.mkdir(dirpath, {recursive: true});
  }

  private async touch(file: string): Promise<void> {
    file = path.join(this.appPath, init.defaultSettingsDir, file);
    const handler: fs.FileHandle = await fs.open(path.resolve(file), 'w');

    return handler.close();
  }
}