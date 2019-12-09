import { Config, Setting } from 'src/command/init';

describe('Setting', () => {
  describe('getSettingPath', () => {
    test('Normal scenario', () => {
      const inputFile = 'dir1/dir2/inputs/test.side';
      const settingPath = 'test';
      const setting = new Setting();
      setting['inputsDir'] = 'dir1/dir2/inputs/';

      expect(setting.getSettingPath(inputFile)).toBe(settingPath);
    });

    test('Relative path', () => {
      const inputFile = './dir1/dir2/inputs/test.side';
      const settingPath = 'test';
      const setting = new Setting();
      setting['inputsDir'] = './dir1/dir2/inputs/';

      expect(setting.getSettingPath(inputFile)).toBe(settingPath);
    });

    test('When inputsDir and inputFile path different', () => {
      const inputFile = 'dir3/dir4/inputs/test.side';
      const settingPath = 'dir3.dir4.inputs.test';
      const setting = new Setting();
      setting['inputsDir'] = 'dir1/dir2/inputs/';

      expect(setting.getSettingPath(inputFile)).toBe(settingPath);
    });

    test('When there is inputFile in current dir', () => {
      const inputFile = 'test.side';
      const settingPath = 'test';
      const setting = new Setting();
      setting['inputsDir'] = 'dir1/dir2/inputs/';

      expect(setting.getSettingPath(inputFile)).toBe(settingPath);
    });
  });
});

describe('Config', () => {
  describe('getOutputFile', () => {
    const config = new Config();
    config.get = jest.fn()
      .mockImplementation((key: string) => {
        if (key === 'inputsDir') {
          return './inputs';

        } else if (key === 'outputsDir') {
          return './outputs';
        }

        return '';
      });

    test('Normal scenario', () => {
      const inputFile = './inputs/test.side';
      const outputFile = 'outputs/test.side';
      expect(config.getOutputFile(inputFile)).toBe(outputFile);
    });

    test('There is not side file in inputs directory', () => {
      const inputFile = './hoge/test.side';
      const outputFile = 'outputs/hoge/test.side';
      expect(config.getOutputFile(inputFile)).toBe(outputFile);
    });

    test('Input file is absolute path', () => {
      const inputFile = '/dir1/dir2/test.side';
      const outputFile = 'outputs/dir1/dir2/test.side';
      expect(config.getOutputFile(inputFile)).toBe(outputFile);
    });
  });
});