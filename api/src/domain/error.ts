// tslint:disable max-classes-per-file

import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status'

enum ErrorCode {
  API_ERROR = 'INTERNAL',
  APPLICATION_NOT_FOUND = 'APPLICATION_NOT_FOUND',
  GENERIC_ERROR = 'GENERIC'
}

class ApiError extends Error {
  public code: string
  public statusCode: number

  constructor(message?: string) {
    super(message)

    this.code = ErrorCode.API_ERROR
    this.statusCode = INTERNAL_SERVER_ERROR
  }
}

class ApplicationNotFound extends ApiError {
  constructor(message?: string) {
    super(message)

    this.code = ErrorCode.APPLICATION_NOT_FOUND
    this.statusCode = NOT_FOUND
  }
}

export { ApiError, ApplicationNotFound, ErrorCode }
