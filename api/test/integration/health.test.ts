import { OK } from 'http-status'
import * as supertest from 'supertest'
import { app } from '../../src/app'

describe('health', () => {
  test('responds with status 200', async () => {
    const response = await supertest(app)
      .get('/health')

    expect(response.status).toEqual(OK)
  })

  test('responds contract as JSON', async () => {
    const response = await supertest(app)
      .get('/health')

    expect(response.body).toEqual({ up: true })
  })
})
