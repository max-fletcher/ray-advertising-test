import { CustomException } from './CustomException.error';

export class ValidationException extends CustomException {
  statusCode = 422;
  constructor(message: string) {
    super(message, 422);
    Object.setPrototypeOf(this, ValidationException.prototype);
    this.name = this.constructor.name;
  }
}
