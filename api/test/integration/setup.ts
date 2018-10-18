import * as Koa from 'koa'
import * as supertest from 'supertest'

const request = (app: Koa): supertest.SuperTest<supertest.Test> => {
  return supertest(app.listen())
}

export { request }
