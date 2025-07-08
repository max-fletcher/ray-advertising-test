import { CustomException } from "./CustomException.error";

export class EnvVarNotFoundError extends CustomException {
  statusCode = 500;
  constructor(message: string) {
    super(message, 500);
    Object.setPrototypeOf(this, EnvVarNotFoundError.prototype);
    this.name = this.constructor.name;
  }
}
