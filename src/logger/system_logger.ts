
import { Base } from 'src/logger/base'

export class SystemLogger extends Base {
    public static get instance(): SystemLogger {
        if (!this._instance) {
            this._instance = new SystemLogger('system');
        }

        return this._instance;
    }

    public info(message: string) {
        this.logger.info(message);
    }

    public debug(message: string) {
        this.logger.debug(message);
    }

    public warn(message: string) {
        this.logger.warn(message)
    }
    

    public error(message: string) {
        this.logger.error(message);
    }

    public fatal(message: string) {
        this.logger.fatal(message);
    }
}