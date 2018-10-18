import { INTERNAL_SERVER_ERROR } from 'http-status'
import { Context } from 'koa'
import * as Router from 'koa-router'
import { buildApp } from '../../src/app'
import { ApiError } from '../../src/domain/error'
import { request } from './setup'

describe('middleware', () => {
  describe('request body as JSON', () => {
    const app = buildApp((router: Router) => {
      router.post('/req-body', async (ctx: Context) => {
        ctx.body = { requestBody: ctx.request.body }
      })
    })

    test('parses request body as JSON when the Content-Type header is application/json', async () => {
      const response = await request(app)
        .post('/req-body')
        .send('{"a": {"b": 1}}')
        .set('Content-Type', 'application/json')

      expect(response.body).toEqual({ requestBody: { a: { b: 1 } } })
    })

    test('does not parse request body as JSON when the Content-Type header is text/html', async () => {
      const response = await request(app)
        .post('/req-body')
        .send('{"a": {"b": 1}}')
        .set('Content-Type', 'text/html')

      expect(response.body).toEqual({ requestBody: {} })
    })
  })

  describe('error handling', () => {
    interface SuiteConfig {
      error: Error | ApiError
      expectedBody: object
      expectedStatus: number
    }

    const suite = (config: SuiteConfig) => async () => {
      const app = buildApp((router: Router) => {
        router.get('/throw', () => { throw config.error })
      })

      const response = await request(app)
        .get('/throw')

      expect(response.status).toEqual(config.expectedStatus)
      expect(response.body).toEqual(config.expectedBody)
    }

    describe('generic error', () => {
      const config: SuiteConfig = {
        error: new Error(),
        expectedBody: { code: 'GENERIC' },
        expectedStatus: INTERNAL_SERVER_ERROR
      }

      test('responds with proper status and contract', suite(config))
    })

    describe('api error', () => {
      const config: SuiteConfig = {
        error: new ApiError(),
        expectedBody: { code: 'INTERNAL' },
        expectedStatus: INTERNAL_SERVER_ERROR
      }

      test('responds with proper status and contract', suite(config))
    })
  })
})
