const { GraphQLError } = require('graphql');

class ValidationError extends GraphQLError {
  constructor(message) {
    super(message, {
      extensions: {
        code: 'VALIDATION_ERROR',
        http: { status: 200 }
      }
    });
  }
}

class NotFoundError extends GraphQLError {
  constructor(message) {
    super(message, {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 200 }
      }
    });
  }
}

module.exports = {
  ValidationError,
  NotFoundError
}; 