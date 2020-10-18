import {Xpath} from 'src/template/xpath';
import {Text} from 'src/template/text';
import {Converter} from 'src/command/converter';
import {mocked} from 'ts-jest/utils';
import {Setting} from 'src/command/init';

jest.mock('src/template/xpath');
jest.mock('src/template/text');

describe('Converter', () => {
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
      const xpath = new Xpath({xpathSettingFile: 'xpathSettingFile'});
      const converter = new Converter();
      const mockReplace = converter['replace'](xpath);
      const target = '{xpath:NORMAL_SCENARIO_XPATH}';
      expect(mockReplace(target)).toBe(expected);
    });

    test('Contain multi different templete', () => {
      mocked(Text).mockImplementation(
        (): any => {
          return {
            getSettings: (): object => {
              return {
                TEXT1: 'normal_scenario_text1',
                TEXT2: 'normal_scenario_text2'
              };
            },
            getTemplate: jest.fn().mockImplementationOnce((): string => {
              return '{text:TEXT1}';
            }).mockImplementationOnce((): string => {
              return '{text:TEXT2}';
            }),
            convSetting: jest.fn().mockImplementationOnce((): string => {
              return 'normal_scenario_text1';
            }).mockImplementationOnce((): string => {
              return 'normal_scenario_text2';
            }),
          };
        }
      );
      const expected = '{text:NOT_MATCH} test normal_scenario_text1 hoge normal_scenario_text2';
      const text = new Text({textSettingFile: 'textSettingFile'});
      const converter = new Converter();
      const mockReplace = converter['replace'](text);
      const target = '{text:NOT_MATCH} test {text:TEXT1} hoge {text:TEXT2}';
      expect(mockReplace(target)).toBe(expected);
    });
  });

  describe('getSetting', () => {
    interface Arg {
      name: string;
      inputFile: string;
      settingObj: object;
      expected: object;
    }

    test('Normal scenario', async () => {
      const settingObj1 = {
        root: {
          dir1: {
            key1: 'value1',
            dir2: {
              key2: 'value2',
              dir3: {
                key3: 'value3',
              }
            }
          }
        }
      };
      const expected1 = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      };
      const settingObj2 = {
        root: {
          other1: {
            key1: 'value1',
            dir2: {
              key2: 'value2',
              other3: {
                key3: 'value3',
              }
            }
          }
        }
      };
      const expected2 = {};
      const settingObj3 = {
        root: {
          dir1: {
            key1: 'value1',
            dir2: {
              key2: 'value2',
              other3: {
                key3: 'value3',
              }
            }
          }
        }
      };
      const expected3 = {
        key1: 'value1',
        key2: 'value2',
      };
      const settingObj4 = {
        root: {
          dir1: {
            key1: 'value1',
            dir2: {
              key1: 'value2',
            }
          }
        }
      };
      const expected4 = {
        key1: 'value2',
      };

      const args: Array<Arg> = [
        {
          name: 'root',
          inputFile: 'inputsDir/dir1/dir2/dir3',
          settingObj: settingObj1,
          expected: expected1
        },
        {
          name: 'root',
          inputFile: 'inputsDir/dir1/dir2/dir3',
          settingObj: settingObj2,
          expected: expected2
        },
        {
          name: 'root',
          inputFile: 'inputsDir/dir1/dir2/dir3',
          settingObj: settingObj3,
          expected: expected3
        },
        {
          name: 'root',
          inputFile: 'inputsDir/dir1/dir2/dir3',
          settingObj: settingObj4,
          expected: expected4
        },
      ];

      args.forEach((arg: Arg) => {
        const setting = new Setting();
        setting['inputsDir'] = 'inputsDir';
        setting['setting'] = arg.settingObj;

        const converter = new Converter();
        const getSetting = converter['getSettingFn'](arg.inputFile, setting);
        expect(getSetting(arg.name)).toStrictEqual(arg.expected);
      });
    });
  });
});