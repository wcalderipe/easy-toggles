import { NOT_FOUND, OK } from 'http-status'
import * as supertest from 'supertest'
import { app } from '../../src/app'

describe('toggles', () => {
  test('responds with status 200', async () => {
    const response = await supertest(app)
      .get('/toggles?application=FooApp&country=BR')

    expect(response.status).toEqual(OK)
  })

  test('responds with toggles contract', async () => {
    const response = await supertest(app)
      .get('/toggles?application=FooApp&country=BR')
    const expectedResponseBody = {
      bar: false,
      foo: true
    }

    expect(response.body).toEqual(expectedResponseBody)
  })

  test('responds with status 404 if application is not found', async () => {
    const response = await supertest(app)
      .get('/toggles?application=BananaApp')

    expect(response.status).toEqual(NOT_FOUND)
  })
})
