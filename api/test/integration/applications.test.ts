import { CREATED } from 'http-status'
import { app } from '../../src/app'
import { request } from './setup'

describe('applications', () => {
  const payload = {
    features: [
      {
        criteria: {
          country: ['AU']
        },
        name: 'foo'
      }
    ],
    name: 'FooApp'
  }

  test('responds with status 201 and created application', async () => {
    const response = await request(app)
      .post('/applications')
      .send(payload)

    expect(response.status).toEqual(CREATED)
    expect(response.body).toEqual(payload)
  })
})
