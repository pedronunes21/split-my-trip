import { NextResponse } from "next/server";

enum ApiErrorCodes {
    "INVALID_REQUEST",
    "UNAUTHORIZED",
    "NOT_FOUND",
    "SERVER_ERROR",
    "UNKNOWN"
}

export type ApiError = {
  code: ApiErrorCodes;
  details: string | null;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T | null;
  error: ApiError | null;
  meta: {
    statusCode: number;
    timestamp: string;
  };
};

class NxResponseBuilder {
  private createResponse<T>(
    success: boolean,
    message: string,
    data: T | null,
    error: ApiError | null,
    statusCode: number
  ): NextResponse<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success,
      message,
      data,
      error,
      meta: {
        statusCode,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, { status: statusCode });
  }

  /**
   * 
   * @param message A message to be displayed to the user
   * @param data Any data to be returned to the user
   * @param statusCode The status code to be returned to the user
   * @returns 
   */
  success<T>(
    message: string,
    data: T,
    statusCode: number = 200
  ): NextResponse<ApiResponse<T>> {
    return this.createResponse(true, message, data, null, statusCode);
  }

  /**
   * 
   * @param message A message to be displayed to the user
   * @param error - {code: string, details: string | null}
   * @param statusCode The status code to be returned to the user
   * @returns 
   */
  fail(
    message: string,
    error: ApiError,
    statusCode: number = 400
  ): NextResponse<ApiResponse<null>> {
    return this.createResponse(false, message, null, error, statusCode);
  }
}

export const NxResponse = new NxResponseBuilder();
