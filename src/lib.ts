
import { promises as fs } from 'fs';

export async function readJson(input: string) {
    const file = await fs.readFile(input, 'utf-8')
    return JSON.parse(file);
}