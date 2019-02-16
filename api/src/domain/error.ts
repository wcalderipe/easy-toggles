// tslint:disable max-classes-per-file

import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status'

export enum ErrorCode {
  API_ERROR = 'INTERNAL',
  APPLICATION_NOT_FOUND = 'APPLICATION_NOT_FOUND',
  CRITERIA_NOT_FOUND = 'CRITERIA_NOT_FOUND',
  GENERIC_ERROR = 'GENERIC'
}

export class ApiError extends Error {
  public code: string
  public statusCode: number

  constructor(message?: string) {
    super(message)

    this.code = ErrorCode.API_ERROR
    this.statusCode = INTERNAL_SERVER_ERROR
  }
}

export class ApplicationNotFound extends ApiError {
  constructor(message?: string) {
    super(message)

    this.code = ErrorCode.APPLICATION_NOT_FOUND
    this.statusCode = NOT_FOUND
  }
}

export class CriteriaNotFound extends ApiError {
  constructor(message?: string) {
    super(message)

    this.code = ErrorCode.CRITERIA_NOT_FOUND
    this.statusCode = NOT_FOUND
  }
}
