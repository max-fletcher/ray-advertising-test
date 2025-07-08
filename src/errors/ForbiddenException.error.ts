import { CustomException } from './CustomException.error';

export class ForbiddenException extends CustomException {
  statusCode = 403;
  constructor(message: string) {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenException.prototype);
    this.name = this.constructor.name;
  }
}
