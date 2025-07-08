export class CustomException extends Error {
  statusCode;
  constructor(message: string, statusCode: number) {
    super(message);
    Object.setPrototypeOf(this, CustomException.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
