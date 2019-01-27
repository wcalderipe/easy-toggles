import * as Koa from 'koa'
import * as supertest from 'supertest'

const request = (app: Koa): supertest.SuperTest<supertest.Test> => supertest(app.listen())

const graphqlRequest = (app: Koa): supertest.Request =>
  request(app)
    .post('/graphql')
    .set('Accept', 'application/json')

export { request, graphqlRequest }
