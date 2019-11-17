import { SystemLogger } from 'src/logger/system_logger';
import _ from 'lodash';
import { Config } from 'src/command/init';
import { Converter } from 'src/command/converter';
import { promises as fs } from 'fs';
import { Walker } from 'src/command/walker';
import * as path from 'path';

const EXT_NAME_SIDE = '.side';

export class Convert implements Walker {
  private config: Config

  constructor(config: Config) {
    this.config = config;
  }

  public default(inputFile: string): void {
    this.execConverter(inputFile).then(() => {
      SystemLogger.instance.info(`${inputFile} converting finish.`);
    }).catch((e: any) => {
      SystemLogger.instance.warn(e);
    });
  }

  public catch(e: any): void { /** pass */ }

  private async execConverter(inputFile: string): Promise<void> {
    if (path.extname(inputFile) !== EXT_NAME_SIDE) {
      throw `Skipped. ${inputFile} is not side extension.`;
    }

    const converter = await this.getConverter(inputFile);
    converter.exec();
    const outputFile = this.getOutputFile(inputFile);

    fs.mkdir(path.dirname(outputFile), { recursive: true });
    return converter.save(outputFile);
  }

  private getOutputFile(inputFile: string) {
    const absoluteInputFile = path.resolve(inputFile);
    const absoluteInputsDir = path.resolve(this.config.get('inputsDir'));
    const index = absoluteInputFile.indexOf(absoluteInputsDir);
    const relativeInputFile = index === -1 ? inputFile : absoluteInputFile.slice(index + absoluteInputsDir.length);
    return path.join(this.config.get('outputsDir'), relativeInputFile);
  }

  private async getConverter(inputFile: string): Promise<Converter> {
    const converter = new Converter();
    await converter.init(inputFile, this.config);
    return converter;
  }
}