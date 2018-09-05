import { Application } from 'express'
import * as supertest from 'supertest'
import { buildApp } from '../../src/app'

describe('middleware', () => {
  describe('URL encoded body', () => {
    test('does not parse body with extended support', () => {
      const app = buildApp((app: Application) => {
        app.post('/test', (req, res) => res.json(req.body))
      })

      return supertest(app)
        .post('/test')
        .send('foo[bar]=baz')
        .then((response) => {
          expect(response.body).toEqual({ 'foo[bar]': 'baz' })
        })
    })
  })

  describe('request body as JSON', () => {
    const app = buildApp((app: Application) => {
      app.get('/route-66', (req, res) => res.json({}))
      app.post('/req-body', (req, res) => res.send({ requestBody: req.body }))
    })

    test('parses request body as JSON when the Content-Type header is application/json', () => {
      return supertest(app)
        .post('/req-body')
        .send('{"a": {"b": 1}}')
        .set('Content-Type', 'application/json')
        .then((response) => {
          expect(response.body).toEqual({ requestBody: { a: { b: 1 } } })
        })
    })

    test('does not parse request body as JSON when the Content-Type header is not application/json', () => {
      return supertest(app)
        .post('/req-body')
        .send('{"a": {"b": 1}}')
        .set('Content-Type', 'text/html')
        .then((response) => {
          expect(response.body).toEqual({ requestBody: {} })
        })
    })
  })
})
