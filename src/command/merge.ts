import * as util from 'src/util';
import { SideFile, Test, Command } from 'src/template/side';
import { promises as fs } from 'fs';
import _ from 'lodash';
import { SystemLogger } from 'src/logger/system_logger';

export class Merge {
  static readJson: (input: string) => Promise<object>;
  private name: string;
  private mergeEachFn: (target: Test, commands: Array<Command>) => void;

  constructor(name: string) {
    this.name = name;
    this.mergeEachFn = this.mergeCommandsBefore;
  }

  public async beforeEach(testId: string, files: Array<string>): Promise<Array<void>> {
    this.mergeEachFn = this.mergeCommandsBefore;
    const result = await this.mergeEach(files, await this.getCommands(testId, files));
    return this.overwriteFiles(files, result);
  }

  public async afterEach(testId: string, files: Array<string>): Promise<Array<void>> {
    this.mergeEachFn = this.mergeCommandsAfter;
    const result = await this.mergeEach(files, await this.getCommands(testId, files));
    return this.overwriteFiles(files, result);
  }

  public async exec(files: Array<string>, outputFile: string): Promise<void> {
    const result = await Merge.readJson(files.shift() as string) as SideFile;
    if (this.name) result.name = name;
    this.save(outputFile, await this.merge(files, result));
  }

  private async getCommands(testId: string, files: Array<string>): Promise<Array<Command>> {
    const source = files.shift() as string;
    const readedSource = await Merge.readJson(source) as SideFile;
    const test: Test | undefined = _.find(readedSource.tests, { id: testId });
    if (test === undefined) {
      SystemLogger.instance.log('Not found test of specified id');
      return [];
    }

    return test.commands;
  }

  private overwriteFiles(outputFiles: Array<string>, sideFiles: Array<SideFile>): Promise<Array<void>> {
    return Promise.all(sideFiles.map((file: SideFile, index: number) => {
      return this.save(outputFiles[index], file);
    }));
  }

  private async save(outputFile: string, sideFile: SideFile): Promise<void> {
    return fs.writeFile(outputFile, JSON.stringify(sideFile, null, '    '));
  }

  private async merge(files: Array<string>, result: SideFile, index = 0): Promise<SideFile> {
    if (index >= files.length) {
      return result;
    }

    const file = await Merge.readJson(files[index]) as SideFile;
    this.mergeTests(result, file);
    return this.merge(files, result, index + 1);
  }

  private mergeTests(target: SideFile, source: SideFile): void {
    target.tests = target.tests.concat(source.tests);
  }

  private async mergeEach(files: Array<string>, commands: Array<Command>, index = 0, result: Array<SideFile> = []): Promise<Array<SideFile>> {
    if (index >= files.length) {
      return result;
    }

    const file = await Merge.readJson(files[index]) as SideFile;
    result.push(file);
    file.tests.forEach((test: Test) => {
      this.mergeEachFn(test, commands);
    });
    return this.mergeEach(files, commands, index + 1, result);
  }

  private mergeCommandsBefore(target: Test, commands: Array<Command>): void {
    // All tests in target add to head
    target.commands = commands.concat(target.commands);
  }

  private mergeCommandsAfter(target: Test, commands: Array<Command>): void {
    // All tests in target add to tail
    target.commands = target.commands.concat(commands);
  }
}

Merge.readJson = util.readJson;