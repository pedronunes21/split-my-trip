declare global {
  enum ApiErrorCodes {
    "INVALID_REQUEST",
    "UNAUTHORIZED",
    "NOT_FOUND",
    "SERVER_ERROR",
    "UNKNOWN",
  }
}

export { ApiErrorCodes };
