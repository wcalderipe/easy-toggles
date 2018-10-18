import { OK } from 'http-status'
import { app } from '../../src/app'
import { request } from './setup'

describe('health', () => {
  test('responds with status 200', async () => {
    const response = await request(app)
      .get('/health')

    expect(response.status).toEqual(OK)
  })

  test('responds contract as JSON', async () => {
    const response = await request(app)
      .get('/health')

    expect(response.body).toEqual({ up: true })
  })
})
