import {SystemLogger} from 'src/logger/systemLogger';
import {Setting, Config} from 'src/command/init';
import {Converter} from 'src/command/converter';
import {promises as fs} from 'fs';
import {Walker} from 'src/command/walker';
import * as path from 'path';


export class Convert implements Walker {
  private readonly config: Config;
  private readonly setting: Setting;

  constructor(config: Config, setting: Setting) {
    this.config = config;
    this.setting = setting;
  }

  public default(inputFile: string): void {
    this.execConverter(inputFile).catch((e: any) => {
      SystemLogger.instance.warn(e);
    });
  }

  public catch(e: any): void {
    SystemLogger.instance.error(e.message);
  }

  private async execConverter(inputFile: string): Promise<void> {
    if (!this.config.isSideFileExtname(inputFile)) {
      throw `Skipped. ${inputFile} is not side extension.`;
    }

    const converter = await this.getConverter(inputFile);
    converter.exec();

    const outputFile = this.config.getOutputFile(inputFile);
    fs.mkdir(path.dirname(outputFile), {recursive: true});
    return converter.save(outputFile);
  }

  private async getConverter(inputFile: string): Promise<Converter> {
    const converter = new Converter();
    await converter.init(inputFile, this.config.get('filesDir'), this.setting);
    return converter;
  }
}