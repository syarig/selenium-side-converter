
import log4js from 'log4js';

interface Loggable {
    log(message: string): void
}

export class Base implements Loggable {
    protected static _instance: any;
    protected logger: log4js.Logger;

    protected constructor(name: string) {
        this.logger = log4js.getLogger(name);
        this.logger.level = 'warn';
    }

    public log(message: string) {
        console.log(message);
    }
}