class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    console.log(message.error);
  }
}

module.exports = UnauthorizedError;
