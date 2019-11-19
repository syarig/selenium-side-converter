
import { Xpath } from '@/template/xpath';
import { Text } from '@/template/text';
import { Converter } from '@/command/converter';
import { mocked } from 'ts-jest/utils';

jest.mock('template/xpath');
jest.mock('template/text');

describe('replace', () => {
  beforeEach(() => {
    mocked(Xpath).mockClear();
    mocked(Text).mockClear();
  });

  test('Normal scenario', () => {
    mocked(Xpath).mockImplementation(
      (): any => {
        return {
          getSettings: (): object => {
            return {
              NORMAL_SCENARIO_XPATH: 'normal_scenario_xpath'
            };
          },
          getTemplate: (): string => {
            return '{xpath:NORMAL_SCENARIO_XPATH}';
          },
          convSetting: (): string => {
            return 'xpath=normal_scenario_xpath';
          },
        };
      }
    );
    const expected = 'xpath=normal_scenario_xpath';
    const xpath = new Xpath({ xpathSettingFile: 'xpathSettingFile' });
    const converter = new Converter();
    const mockReplace = converter['replace'](xpath);
    const target = '{xpath:NORMAL_SCENARIO_XPATH}';
    expect(mockReplace(target)).toBe(expected);
  });

  test('Multi contained template', () => {
    mocked(Text).mockImplementation(
      (): any => {
        return {
          getSettings: (): object => {
            return {
              NORMAL_SCENARIO_XPATH: 'normal_scenario_xpath'
            };
          },
          getTemplate: (): string => {
            return '{text:NORMAL_SCENARIO_XPATH}';
          },
          convSetting: (): string => {
            return 'normal_scenario_xpath';
          },
        }
      }
    );
    const expected = '{text:NOT_MATCH} test normal_scenario_xpath hoge normal_scenario_xpath';
    const text = new Text({ textSettingFile: 'textSettingFile' });
    const converter = new Converter();
    const mockReplace = converter['replace'](text);
    const target = '{text:NOT_MATCH} test {text:NORMAL_SCENARIO_XPATH} hoge {text:NORMAL_SCENARIO_XPATH}';
    expect(mockReplace(target)).toBe(expected);
  });
});

describe('getSettingsByInput', () => {
  test('Normal scenario', () => {
    const converter = new Converter();
    const inputsDir = 'dir1/dir2/inputs/';
    const inputFile = 'dir1/dir2/inputs/test.side';
    const expected = { expected: 'settings' };
    const settings = { test: expected };
    expect(converter['getSettingsByInput'](inputsDir, inputFile, settings)).toEqual(expected);
  });

  test('Relative path', () => {
    const converter = new Converter();
    const inputsDir = './dir1/dir2/inputs/';
    const inputFile = './dir1/dir2/inputs/test.side';
    const expected = { expected: 'settings' };
    const settings = { test: expected };
    expect(converter['getSettingsByInput'](inputsDir, inputFile, settings)).toEqual(expected);
  });

  test('When inputsDir and inputFile path different', () => {
    const converter = new Converter();
    const inputsDir = 'dir1/dir2/inputs/';
    const inputFile = 'dir3/dir4/inputs/test.side';
    const expected = { expected: 'settings' };
    const settings = { dir3: { dir4: { inputs: { test: expected } } } };
    expect(converter['getSettingsByInput'](inputsDir, inputFile, settings)).toEqual(expected);
  });

  test('When there is inputFile in current dir', () => {
    const converter = new Converter();
    const inputsDir = 'dir1/dir2/inputs/';
    const inputFile = 'test.side';
    const expected = { expected: 'settings' };
    const settings = { test: expected };
    expect(converter['getSettingsByInput'](inputsDir, inputFile, settings)).toEqual(expected);
  });
});