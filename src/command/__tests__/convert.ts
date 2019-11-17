import { Config } from "src/command/init";
import { Convert } from "src/command/convert";
import { mocked } from "ts-jest/utils";

jest.mock('src/command/init');

describe('getOutputFile', () => {
    beforeEach(() => {
        mocked(Config).mockClear()
    });

    test('Normal scenario', () => {
        mocked(Config).mockImplementation(
            (): any => {
                return {
                    get: (key: string): string => {
                        if (key === 'inputsDir') {
                            return './inputs';

                        } else if (key === 'outputsDir') {
                            return './outputs';
                        }

                        return '';
                    }
                }
            }
        )
        const config = new Config();
        const inputFile = './inputs/test.side';
        const outputFile = 'outputs/test.side';
        const convert = new Convert(config);
        expect(convert['getOutputFile'](inputFile)).toBe(outputFile);
    });

    test('There is not side file in inputs directory', () => {
        mocked(Config).mockImplementation(
            (): any => {
                return {
                    get: (key: string): string => {
                        if (key === 'inputsDir') {
                            return './inputs';

                        } else if (key === 'outputsDir') {
                            return './outputs';
                        }

                        return '';
                    }
                }

            }
        )

        const config = new Config();
        const inputFile = './hoge/test.side';
        const outputFile = 'outputs/hoge/test.side';
        const convert = new Convert(config);

        expect(convert['getOutputFile'](inputFile)).toBe(outputFile);
    });

    test('Input file is absolute path', () => {
        mocked(Config).mockImplementation(
            (): any => {
                return {
                    get: (key: string): string => {
                        if (key === 'inputsDir') {
                            return './inputs';

                        } else if (key === 'outputsDir') {
                            return './outputs';
                        }

                        return '';
                    }
                }

            }
        )

        const config = new Config();
        const inputFile = '/dir1/dir2/test.side';
        const outputFile = 'outputs/dir1/dir2/test.side';
        const convert = new Convert(config);
        
        expect(convert['getOutputFile'](inputFile)).toBe(outputFile);
    });
});
