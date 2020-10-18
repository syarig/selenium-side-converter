import {Base} from 'src/logger/base';

export class SystemLogger extends Base {
  public static get instance(): SystemLogger {
    if (!this._instance) {
      this._instance = new SystemLogger('system');
    }

    return this._instance;
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }


  public error(message: string): void {
    this.logger.error(message);
  }
}