
import { promises as fs } from 'fs';
import _ from 'lodash';
import { SystemLogger } from '@/logger/system_logger';

export async function readJson(input: string) {
    let content = {};
    try {
        const file = await fs.readFile(input, 'utf-8');
        content = JSON.parse(file);
    } catch {
        SystemLogger.instance.error(`Failed to read json file ${input}`);
    }
    return content;
}