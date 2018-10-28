import { CREATED } from 'http-status'
import { app } from '../../src/app'
import { request } from './setup'

describe('application', () => {
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
    const uuidRegEx = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g

    const response = await request(app)
      .post('/application')
      .send(payload)

    expect(response.status).toEqual(CREATED)
    expect(response.body).toMatchObject({
      ...payload,
      id: expect.stringMatching(uuidRegEx)
    })
  })
})
