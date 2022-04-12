class DomainError extends Error {
  constructor(message = "Internal Server Error", status_code = 500, view = "home", errors = []) {
    super();
    this.message = message;
    this.status_code = status_code;
    this.name = this.constructor.name;
    this.errors = errors;
    this.view = view;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends DomainError {
  constructor(message = "Bad request", view) {
    super(message, 400, view);
  }
}

export class InternalError extends DomainError {
  constructor(message = "Internal server error", view) {
    super(message, 500, view);
  }
}

export class AuthorizationError extends DomainError {
  constructor(message = "Unauthorized", view) {
    super(message, 403, view);
  }
}

export class AuthenticationError extends DomainError {
  constructor(message = "Authentication failed", view) {
    super(message, 401, view);
  }
}

export class ResourceNotFoundError extends DomainError {
  constructor(message = "Resource not found", view) {
    super(message, 404, view);
  }
}

export class MailError extends DomainError {
  constructor(message = "Something went wrong with Mail service", view) {
    super(message, 502, view);
  }
}

export class ValidationError extends DomainError {
  constructor(message = "Validation failed", view, errors) {
    super(message, 422, errors, view);
  }
}
