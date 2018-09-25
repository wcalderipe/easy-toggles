import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { INTERNAL_SERVER_ERROR } from 'http-status'
import { ApiError, ErrorCode } from './domain/error'

const onError = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    return next()
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ code: err.code })
  } else {
    return res.status(INTERNAL_SERVER_ERROR).json({ code: ErrorCode.GENERIC_ERROR })
  }
}

export { onError }
