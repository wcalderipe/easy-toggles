import { NOT_FOUND, OK } from 'http-status'
import { app } from '../../src/app'
import { ErrorCode } from '../../src/domain/error'
import { request } from './setup'

describe('toggles', () => {
  test('responds with status 200', async () => {
    const response = await request(app)
      .get('/toggles?application=FooApp&country=BR')

    expect(response.status).toEqual(OK)
  })

  test('responds with toggles contract', async () => {
    const response = await request(app)
      .get('/toggles?application=FooApp&country=BR')
    const expectedResponseBody = {
      bar: false,
      foo: true
    }

    expect(response.body).toEqual(expectedResponseBody)
  })

  describe('application is not found', () => {
    test('responds with status 404 and proper error contract', async () => {
      const response = await request(app)
        .get('/toggles?application=BananaApp')

      expect(response.status).toEqual(NOT_FOUND)
      expect(response.body).toEqual({ code: ErrorCode.APPLICATION_NOT_FOUND })
    })
  })
})
