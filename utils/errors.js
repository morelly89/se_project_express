const invalidDataPassed = {
  message:
    "invalid data passed to the methods for creating an item/user or updating an item, or invalid ID passed to the params.",
};

const userOrItemNotFoundError = {
  message:
    "there is no user or clothing item with the requested id, or the request was sent to a non-existent address",
};

const defaultError = {
  message: "default error. An error has occurred on the server.",
};

module.exports = { invalidDataPassed, userOrItemNotFoundError, defaultError };
