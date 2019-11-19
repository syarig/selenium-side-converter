
import { Logger, getLogger } from 'log4js';

interface Loggable {
    log(message: string): void
}

export class Base implements Loggable {
    protected static _instance: any;
    protected logger: Logger;

    protected constructor(name: string) {
        this.logger = getLogger(name);
        this.logger.level = 'info';
    }

    public log(message: string) {
        console.log(message);
    }
}