import {Merge} from 'src/command/merge';
import {SideFile} from 'src/template/sideFile';


describe('Merge', () => {
  describe('exec', () => {
    interface Arg {
      files: Array<string>;
      expected: SideFile;
    }

    const name = 'merged-side-file-name';
    const url = 'merged-side-file-url';
    const sideFile1: SideFile = {
      name: 'name1',
      url: 'url1',
      tests: [{
        id: 'testId1',
        commands: [{
          id: 'id1',
          command: 'command1',
          target: 'target1',
          targets: [['target1'], ['target2']],
          value: 'value1'
        }],
      }],
      suites: [{tests: ['suite_test1']}]
    };

    const sideFile2: SideFile = {
      name: 'name2',
      url: 'url2',
      tests: [{
        id: 'testId2',
        commands: [
          {
            id: 'id2',
            command: 'command2',
            target: 'target2',
            targets: [['target3'], ['target4']],
            value: 'value2'
          },
          {
            id: 'id3',
            command: 'command3',
            target: 'target3',
            targets: [['target5'], ['target6']],
            value: 'value3'
          }
        ]
      }],
      suites: [{tests: ['suite_test2']}]
    };

    test('Normal scenario', () => {
      const args: Array<Arg> = [{
        files: ['sideFile1.side', 'sideFile2.side'],
        expected: {
          name: name,
          url: url,
          tests: [{
            id: 'testId1',
            commands: [
              {
                id: 'id1',
                command: 'command1',
                target: 'target1',
                targets: [['target1'], ['target2']],
                value: 'value1'
              },
            ],
          }],
          suites: [{tests: ['suite_test1', 'suite_test2']}]
        }
      }];

      args.forEach((arg: Arg) => {
        Merge.readJson = jest.fn()
          .mockImplementationOnce(async () => {
            return new Promise((resolve) => {
              resolve(sideFile1);
            });
          })
          .mockImplementationOnce(async () => {
            return new Promise((resolve) => {
              resolve(sideFile2);
            });
          });

        const merge = new Merge('name');
        merge['save'] = jest.fn();

        merge.exec(arg.files, 'outputFile');
      });
    });
  });

  describe('mergeEach', () => {
    interface Arg {
      files: Array<string>;
      expected: Array<SideFile>;
    }

    let sideFile1: SideFile;
    let sideFile2: SideFile;

    beforeEach(() => {
      sideFile1 = {
        name: 'name1',
        url: 'url1',
        tests: [
          {
            id: 'testId1',
            commands: [
              {
                id: 'id1',
                command: 'command1',
                target: 'target1',
                targets: [['target1'], ['target2']],
                value: 'value1'
              }
            ],
          }
        ],
        suites: [{tests: ['suite_test1']}]
      };

      sideFile2 = {
        name: 'name2',
        url: 'url2',
        tests: [
          {
            id: 'testId2',
            commands: [{
              id: 'id2',
              command: 'command2',
              target: 'target2',
              targets: [['target3'], ['target4']],
              value: 'value2'
            }],
          },
          {
            id: 'testId3',
            commands: [{
              id: 'id3',
              command: 'command3',
              target: 'target3',
              targets: [['target5'], ['target6']],
              value: 'value2'
            }],
          }
        ],
        suites: [{tests: ['suite_test2']}]
      };
    });

    test('beforeEach', async () => {
      const args: Array<Arg> = [{
        files: ['sideFile1.side', 'sideFile2.side'],
        expected: [{
          name: 'name2',
          url: 'url2',
          tests: [
            {
              id: 'testId2',
              commands: [
                {
                  id: 'id1',
                  command: 'command1',
                  target: 'target1',
                  targets: [['target1'], ['target2']],
                  value: 'value1'
                },
                {
                  id: 'id2',
                  command: 'command2',
                  target: 'target2',
                  targets: [['target3'], ['target4']],
                  value: 'value2'
                }
              ],
            },
            {
              id: 'testId3',
              commands: [
                {
                  id: 'id1',
                  command: 'command1',
                  target: 'target1',
                  targets: [['target1'], ['target2']],
                  value: 'value1'
                },
                {
                  id: 'id3',
                  command: 'command3',
                  target: 'target3',
                  targets: [['target5'], ['target6']],
                  value: 'value2'
                }
              ],
            }
          ],
          suites: [{tests: ['suite_test2']}]
        }]
      }];


      await Promise.all(args.map(async (arg: Arg) => {
        Merge.readJson = jest.fn()
          .mockImplementationOnce(async () => {
            return new Promise((resolve) => {
              resolve(sideFile1);
            });
          })
          .mockImplementationOnce(async () => {
            return new Promise((resolve) => {
              resolve(sideFile2);
            });
          });

        const merge = new Merge('name') as any;
        merge.overwriteFiles = jest.fn();
        await merge.beforeEach('testId1', arg.files);
        expect(merge.overwriteFiles.mock.calls[0][0]).toStrictEqual(arg.files);
        expect(merge.overwriteFiles.mock.calls[0][1]).toStrictEqual(arg.expected);
      }));
    });

    test('afterEach', async () => {
      const args: Array<Arg> = [{
        files: ['sideFile1.side', 'sideFile2.side'],
        expected: [{
          name: 'name2',
          url: 'url2',
          tests: [
            {
              id: 'testId2',
              commands: [
                {
                  id: 'id2',
                  command: 'command2',
                  target: 'target2',
                  targets: [['target3'], ['target4']],
                  value: 'value2'
                },
                {
                  id: 'id1',
                  command: 'command1',
                  target: 'target1',
                  targets: [['target1'], ['target2']],
                  value: 'value1'
                }
              ],
            },
            {
              id: 'testId3',
              commands: [
                {
                  id: 'id3',
                  command: 'command3',
                  target: 'target3',
                  targets: [['target5'], ['target6']],
                  value: 'value2'
                },
                {
                  id: 'id1',
                  command: 'command1',
                  target: 'target1',
                  targets: [['target1'], ['target2']],
                  value: 'value1'
                }
              ],
            }
          ],
          suites: [{tests: ['suite_test2']}]
        }]
      }];

      await Promise.all(args.map(async (arg: Arg) => {
        Merge.readJson = jest.fn()
          .mockImplementationOnce(async () => {
            return new Promise((resolve) => {
              resolve(sideFile1);
            });
          })
          .mockImplementationOnce(async () => {
            return new Promise((resolve) => {
              resolve(sideFile2);
            });
          });

        const merge = new Merge('name') as any;
        merge.overwriteFiles = jest.fn();
        await merge.afterEach('testId1', arg.files);
        expect(merge.overwriteFiles.mock.calls[0][0]).toStrictEqual(arg.files);
        expect(merge.overwriteFiles.mock.calls[0][1]).toStrictEqual(arg.expected);
      }));
    });
  });
});