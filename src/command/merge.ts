import * as util from 'src/util';
import _ from 'lodash';
import { SideFile } from 'src/template/side';

export class Merge {
  private mergeFn: (target: SideFile, source: SideFile) => void;

  constructor(isOnlySuites: boolean, isOnlyTests: boolean) {
    this.mergeFn = this.getMergeFn(isOnlySuites, isOnlyTests);
  }

  public async exec(name: string, files: Array<string>) {
    const result = <SideFile>await util.readJson(<string>files.shift());
    if (name) result.name = name;
    await this.merge(files, result);
  }

  private async merge(files: Array<string>, result: SideFile, index: number = 0) {
    if (index >= files.length) {
      return;
    }

    const file = await util.readJson(files[index])
    this.mergeFn(result, <SideFile>file);
    this.merge(files, result, index + 1);
  }

  private getMergeFn(isOnlySuites: boolean, isOnlyTests: boolean) {
    if (isOnlySuites) {
      return this.mergeSuites
    }

    if (isOnlyTests) {
      return this.mergeTests
    }

    return (target: SideFile, source: SideFile) => {
      this.mergeSuites(target, source);
      this.mergeTests(target, source);
    }
  }

  private mergeSuites(target: SideFile, source: SideFile) {
    target.suites = target.suites.concat(source.suites);
  }

  private mergeTests(target: SideFile, source: SideFile) {
    target.tests = target.tests.concat(source.tests);
  }
}