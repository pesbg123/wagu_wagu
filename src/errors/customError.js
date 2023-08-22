class CustomError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
  }
}
module.exports = CustomError;
