import { INTERNAL_SERVER_ERROR } from 'http-status'
import * as Router from 'koa-router'
import { buildApp } from '../../src/app'
import { ApiError } from '../../src/domain/error'
import { request } from './setup'

describe('middleware', () => {
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
