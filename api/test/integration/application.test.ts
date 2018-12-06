import { CREATED, NO_CONTENT, NOT_FOUND, OK } from 'http-status'
import { app } from '../../src/app'
import { ErrorCode } from '../../src/domain/error'
import { Application } from '../../src/domain/type'
import { saveApplication } from '../../src/repository'
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

  describe('GET /application', () => {
    test('responds with status 200 and the application', async () => {
      const application: Application = await saveApplication({ ...payload, name: 'BarApp' })
      const response = await request(app)
        .get(`/application/${application.id}`)

      expect(response.status).toEqual(OK)
      expect(response.body).toEqual(application)
    })
  })

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

  describe('PUT /application', () => {
    test('responds with status 200 and the updated application', async () => {
      const application: Application = await saveApplication({ ...payload, name: 'BarApp' })
      const response = await request(app)
        .put(`/application/${application.id}`)
        .send({ name: 'BarApp' })

      expect(response.status).toEqual(OK)
      expect(response.body).toEqual({ ...application, name: 'BarApp' })
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
