import * as util from 'src/util';
import { SideFile } from 'src/template/side';
import { promises as fs } from 'fs';

export class Merge {
  static readJson: (input: string) => Promise<object>;
  private mergeFn: (target: SideFile, source: SideFile) => void;
  private result: SideFile;

  constructor(isOnlySuites: boolean, isOnlyTests: boolean) {
    this.mergeFn = this.getMergeFn(isOnlySuites, isOnlyTests);
  }

  public async exec(name: string, files: Array<string>): Promise<void> {
    const result = await Merge.readJson(files.shift() as string) as SideFile;
    if (name) result.name = name;
    this.result = await this.merge(files, result);
  }

  public save(outputFile: string): void {
    fs.writeFile(outputFile, JSON.stringify(this.result, null, '    '));
  }

  private async merge(files: Array<string>, result: SideFile, index = 0): Promise<SideFile> {
    if (index >= files.length) {
      return result;
    }

    const file = await Merge.readJson(files[index]) as SideFile;
    this.mergeFn(result, file);
    return this.merge(files, result, index + 1);
  }

  private getMergeFn(isOnlySuites: boolean, isOnlyTests: boolean): (target: SideFile, source: SideFile) => void {
    if (isOnlySuites) {
      return this.mergeSuites;
    }

    if (isOnlyTests) {
      return this.mergeTests;
    }

    return (target: SideFile, source: SideFile): void => {
      this.mergeSuites(target, source);
      this.mergeTests(target, source);
    };
  }

  private mergeSuites(target: SideFile, source: SideFile): void {
    target.suites = target.suites.concat(source.suites);
  }

  private mergeTests(target: SideFile, source: SideFile): void {
    target.tests = target.tests.concat(source.tests);
  }
}

Merge.readJson = util.readJson;