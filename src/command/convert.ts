
import { promises as fs } from 'fs';

export class Convert {
    private input: string;
    private output: string;

    constructor(input: string, output: string) {
        this.input = input;
        this.output = output;
    }

    public async exec() {
    }
}
