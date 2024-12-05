const ERROR_CODES = {
  // General Errors
  INTERNAL_SERVER_ERROR: {
    errorCode: 'E001',
    message: 'Internal server error occurred. Please try again later.'
  },
  INVALID_REQUEST: {
    errorCode: 'E002',
    message: 'The request is invalid. Please check your input.'
  },
  UNAUTHORIZED: {
    errorCode: 'E003',
    message: 'You are not authorized to access this resource.'
  },
  FORBIDDEN: {
    errorCode: 'E004',
    message: 'You do not have permission to perform this action.'
  },
  NOT_FOUND: {
    errorCode: 'E005',
    message: 'The requested resource could not be found.'
  },

  // Authentication Errors
  INVALID_CREDENTIALS: {
    errorCode: 'E101',
    message: 'Invalid username or password.'
  },
  TOKEN_EXPIRED: {
    errorCode: 'E102',
    message: 'Your session has expired. Please log in again.'
  },

  // Validation Errors
  MISSING_FIELD: {
    errorCode: 'E201',
    message: 'Required field is missing.'
  },
  INVALID_EMAIL_FORMAT: {
    errorCode: 'E202',
    message: 'Invalid email format.'
  },

  // Custom Errors
  USER_ALREADY_EXISTS: {
    errorCode: 'E301',
    message: 'A user with this email already exists.'
  },
  RESOURCE_CONFLICT: {
    errorCode: 'E302',
    message: 'The resource you are trying to modify is in conflict with existing data.'
  },
  USER_NOT_FOUND: {
    error: 'E303',
    message: 'A user not found for this session.'
  },
  USER_NOT_ACTIVE: {
    error: 'E304',
    message: 'User not yet activated, please wait for kADR team to review your account.'
  }
}

module.exports = ERROR_CODES
