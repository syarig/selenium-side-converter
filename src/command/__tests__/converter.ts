
import { Converter } from 'src/command/converter';
import * as lib from 'src/util';
import { mocked } from 'ts-jest/utils'

jest.mock('src/command/converter');

describe('exec', () => {
  beforeEach(() => {
    mocked(Converter).mockClear()
  })

  test('Normal scenario', () => {
    const stub = jest.
    const input = 'input';
    const config = { config: 'test' };
    const converter = new Converter();
  })
});