import { Application } from 'express'
import { INTERNAL_SERVER_ERROR } from 'http-status'
import * as supertest from 'supertest'
import { buildApp } from '../../src/app'
import { ApiError } from '../../src/domain/error'

describe('middleware', () => {
  describe('URL encoded body', () => {
    test('does not parse body with extended support', async () => {
      const app = buildApp((app: Application) => {
        app.post('/test', (req, res) => res.json(req.body))
      })
      const expectedResponseBody = { 'foo[bar]': 'baz' }

      const response = await supertest(app)
        .post('/test')
        .send('foo[bar]=baz')

      expect(response.body).toEqual(expectedResponseBody)
    })
  })

  describe('request body as JSON', () => {
    const app = buildApp((app: Application) => {
      app.get('/route-66', (req, res) => res.json({}))
      app.post('/req-body', (req, res) => res.send({ requestBody: req.body }))
    })

    test('parses request body as JSON when the Content-Type header is application/json', async () => {
      const expectedResponseBody = { requestBody: { a: { b: 1 } } }

      const response = await supertest(app)
        .post('/req-body')
        .send('{"a": {"b": 1}}')
        .set('Content-Type', 'application/json')

      expect(response.body).toEqual(expectedResponseBody)
    })

    test('does not parse request body as JSON when the Content-Type header is not application/json', async () => {
      const expectedResponseBody = { requestBody: {} }

      const response = await supertest(app)
        .post('/req-body')
        .send('{"a": {"b": 1}}')
        .set('Content-Type', 'text/html')

      expect(response.body).toEqual(expectedResponseBody)
    })
  })

  describe('error handling', () => {
    interface SuiteConfig {
      error: Error | ApiError
      expectedBody: object
      expectedStatus: number
    }

    const suite = (config: SuiteConfig) => async () => {
      const app = buildApp((app: Application) => {
        app.get('/throw', () => { throw config.error })
      })

      const response = await supertest(app)
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
