import { OK } from 'http-status'
import * as supertest from 'supertest'
import { app } from '../../src/app'

describe('health', () => {
  test('responds with status 200', () => {
    return supertest(app)
      .get('/health')
      .expect(OK)
  })
})
