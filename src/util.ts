
import { promises as fs } from 'fs';
import { SystemLogger } from 'src/logger/systemLogger';

export async function readJson(input: string): Promise<object> {
    let content = {};
    try {
        const file = await fs.readFile(input, 'utf-8');
        content = JSON.parse(file);
    } catch {
        SystemLogger.instance.error(`Failed to read json file ${input}`);
    }
    return content;
}