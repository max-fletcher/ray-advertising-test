import { CustomException } from './CustomException.error';

export class BadRequestException extends CustomException {
  statusCode = 400;
  constructor(message: string) {
    super(message, 400);
    Object.setPrototypeOf(this, BadRequestException.prototype);
    this.name = this.constructor.name;
  }
}
