
import { walk } from 'src/walk';
import { Dirent } from 'fs';

describe('walk', () => {

    test('Normal scenario', () => {
        const dirent1 = new Dirent();
        dirent1.name = 'dir';
        dirent1.isDirectory = jest.fn(() => true);

        const dirent2 = new Dirent();
        dirent2.name = 'file.side';
        dirent2.isDirectory = jest.fn(() => false);

        walk.promises = {
            readdir: jest.fn()
                .mockImplementationOnce(() => {
                    return new Promise((resolve) => {
                        resolve([dirent1]);
                    });
                })
                .mockImplementationOnce(() => {
                    return new Promise((resolve) => {
                        resolve([dirent2]);
                    });
                })
                .mockImplementation(() => {
                    return new Promise((resolve) => {
                        resolve([]);
                    });
                })
        } as any;

        const mockWalker = {
            catch: jest.fn(),
            default: jest.fn().mockImplementationOnce((dirpath: string) => {
                expect(dirpath).toBe('entry/dir/file.side');
            })
        };
        walk('entry', mockWalker);
    });

    test('Exception scenario', () => {

        const expectedError = 'expectedError';

        walk.promises = {
            readdir: jest.fn()
                .mockImplementationOnce(() => {
                    return new Promise((resolve, reject) => {
                        reject(expectedError);
                    });
                })
                .mockImplementation(() => {
                    return new Promise((resolve) => {
                        resolve([]);
                    });
                })
        } as any;

        const mockWalker = {
            catch: jest.fn().mockImplementation((e: any) => {
                expect(e).toBe(expectedError);
            }),
            default: jest.fn()
        };
        walk('entry', mockWalker);
    });
});