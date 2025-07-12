export const TODO_STATUS = {
  INITIAL: 'initial',
  TODO: 'todo',
  DOING: 'doing',
  REVIEW: 'review',
  DONE: 'done',
  KEEPING: 'keeping',
  CANCELLED: 'cancelled',
} as const;

export type TodoStatus = typeof TODO_STATUS[keyof typeof TODO_STATUS];

export const TODO_STATUS_ARRAY = Object.values(TODO_STATUS);

export const DEFAULT_AVATAR = 'https://avatars.dicebear.com/api/male/username.svg';

export const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const MAX_TIME_OTP = 120; // seconds
export const MIN_LENGTH_PASS = 8;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const JWT_DEFAULTS = {
  EXPIRES_IN: '1h',
  REFRESH_EXPIRES_IN: '7d',
} as const;

export const RATE_LIMIT_DEFAULTS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
  OTP_EXPIRED: 'OTP expired',
  OTP_INVALID: 'Invalid OTP',
} as const;
