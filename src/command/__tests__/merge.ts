import { Merge } from 'src/command/merge';
import { SideFile } from 'src/template/side';


interface Arg {
  isOnlySuites: boolean;
  isOnlyTests: boolean;
  name: string;
  files: Array<string>;
  expected: SideFile;
}

describe('Merge', () => {

  describe('exec', () => {
    const name = 'merged-side-file';
    const sideFile1: SideFile = {
      name: 'name1',
      tests: [{
        commands: [{
          id: 'id1',
          command: 'command1',
          target: 'target1',
          targets: [['target1'], ['target2']],
          value: 'value1'
        }],
      }],
      suites: [{ tests: ['suite_test1'] }]
    };

    const sideFile2: SideFile = {
      name: 'name2',
      tests: [{
        commands: [{
          id: 'id2',
          command: 'command2',
          target: 'target2',
          targets: [['target3'], ['target4']],
          value: 'value2'
        }]
      }],
      suites: [{ tests: ['suite_test2'] }]
    };

    test('Normal scenario', () => {
      const args: Array<Arg> = [{
        isOnlySuites: false,
        isOnlyTests: false,
        name: name,
        files: ['sideFile1', 'sideFile2'],
        expected: {
          name: name,
          tests: [{
            commands: [{
              id: 'id1',
              command: 'command1',
              target: 'target1',
              targets: [['target1'], ['target2']],
              value: 'value1'
            }, {
              id: 'id2',
              command: 'command2',
              target: 'target2',
              targets: [['target3'], ['target4']],
              value: 'value2'
            }],
          }],
          suites: [{ tests: ['suite_test1', 'suite_test2'] }]
        }
      }];

      args.forEach((arg: Arg) => {
        Merge.readJson = jest.fn()
          .mockImplementation(async () => {
            return new Promise((resolve) => {
              resolve(sideFile1);
            });
          })
          .mockImplementation(async () => {
            return new Promise((resolve) => {
              resolve(sideFile2);
            });
          });

        const merge = new Merge(arg.isOnlySuites, arg.isOnlyTests);
        merge.exec(arg.name, arg.files);
      });
    });
  });
});