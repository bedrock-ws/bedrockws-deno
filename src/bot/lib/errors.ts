export class SyntaxError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, SyntaxError.prototype);
  }
}

export class TypeError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, TypeError.prototype);
  }
}

export class MissingArgumentError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, TypeError.prototype);
  }
}

export class UnknownCommandError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, TypeError.prototype);
  }
}

export class TooManyArgumentsError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, TypeError.prototype);
  }
}
