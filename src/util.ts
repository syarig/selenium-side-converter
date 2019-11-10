
import { promises as fs } from 'fs';
import _ from 'lodash';

export async function readJson(input: string) {
    let content = {};
    try {
        const file = await fs.readFile(input, 'utf-8');
        content = JSON.parse(file);
    } catch {
        console.log(`Failed to read json file ${input}`);
    }
    return content;
}