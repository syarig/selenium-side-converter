
import { promises as fs } from 'fs';

export class Convert {
    private input: string;
    private output: string;

    constructor(input: string, output: string) {
        this.input = input;
        this.output = output;
    }

    public async exec() {
        try {
            await this.parse(this.input)

        } catch (err) {
            console.log(err.message);
        }
    }

    private async parse(input: string) {
        const file = await fs.readFile(input, 'utf-8')
        const pasedFile = JSON.parse(file);
    }
}
