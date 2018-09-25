// tslint:disable max-classes-per-file

import { INTERNAL_SERVER_ERROR } from 'http-status'

enum ErrorCode {
  GENERIC_ERROR = 'GENERIC',
  API_ERROR = 'INTERNAL'
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

export {
  ApiError,
  ErrorCode
}
