import { CREATED, NO_CONTENT, NOT_FOUND } from 'http-status'
import { app } from '../../src/app'
import { ErrorCode } from '../../src/domain/error'
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

  describe('POST /application', () => {
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

  describe('DELETE /application/{ID}', () => {
    test('responds with status 204', async () => {
      const createResponse = await request(app)
        .post('/application')
        .send(payload)
      const { id } = createResponse.body

      const response = await request(app)
        .delete(`/application/${id}`)

      expect(response.status).toEqual(NO_CONTENT)
    })

    test('responds with status 404 when the given application is not found', async () => {
      const response = await request(app)
        .delete('/application/i-am-not-here')

      expect(response.status).toEqual(NOT_FOUND)
      expect(response.body).toEqual({
        code: ErrorCode.APPLICATION_NOT_FOUND
      })
    })
  })
})
