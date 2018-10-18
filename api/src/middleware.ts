import { INTERNAL_SERVER_ERROR } from 'http-status'
import * as Koa from 'koa'
import { ApiError, ErrorCode } from './domain/error'

const onError = async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof ApiError) {
      ctx.status = err.statusCode
      ctx.body = { code: err.code }
    } else {
      ctx.status = INTERNAL_SERVER_ERROR
      ctx.body = { code: ErrorCode.GENERIC_ERROR }
    }
  }
}

export { onError }
