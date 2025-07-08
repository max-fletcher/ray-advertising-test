import { CustomException } from './CustomException.error';

export class NotFoundException extends CustomException {
  statusCode = 404;
  constructor(message: string) {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundException.prototype);
    this.name = this.constructor.name;
  }
}
