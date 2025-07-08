import { CustomException } from "./CustomException.error";

export class EnvVarEmptyError extends CustomException {
  statusCode = 500;
  constructor(message: string) {
    super(message, 500);
    Object.setPrototypeOf(this, EnvVarEmptyError.prototype);
    this.name = this.constructor.name;
  }
}
