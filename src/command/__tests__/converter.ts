
import { Xpath } from 'src/template/xpath';
import { Text } from 'src/template/text';
import { Converter } from 'src/command/converter';
import { mocked } from 'ts-jest/utils';

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
})