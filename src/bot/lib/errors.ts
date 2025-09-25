/**
 * Error thrown when the syntax of the command is incorrect.
 */
export class SyntaxError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, SyntaxError.prototype);
  }
}

/**
 * Error thrown when the argument for a parameter is not of the expected type.
 */
export class TypeError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, TypeError.prototype);
  }
}

/**
 * Error thrown when the user provided too few arguments to a command.
 */
export class MissingArgumentError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, MissingArgumentError.prototype);
  }
}

/**
 * Error thrown when an argument of a command's parameter is only provided
 * partially.
 *
 * This is the case when a parameter expects for example three integers but the
 * user only provided a single integer.
 */
export class PartialArgumentError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, PartialArgumentError.prototype);
  }
}

/**
 * Error thrown when the user tried to invoke a command that is not registered
 * by the bot.
 */
export class UnknownCommandError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, UnknownCommandError.prototype);
  }
}

/**
 * Error thrown when the user provided more arguments than the command expects.
 */
export class TooManyArgumentsError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, TooManyArgumentsError.prototype);
  }
}
