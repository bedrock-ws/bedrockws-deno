export class SyntaxError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, SyntaxError.prototype);
  }
}

export class TypeError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, TypeError.prototype);
  }
}

export class MissingArgumentError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, MissingArgumentError.prototype);
  }
}

export class UnknownCommandError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, UnknownCommandError.prototype);
  }
}

export class TooManyArgumentsError extends Error {
  constructor(m: string) {
    super(m);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, TooManyArgumentsError.prototype);
  }
}
