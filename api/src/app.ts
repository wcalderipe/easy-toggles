import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import { onError } from './middleware'
import { deleteApplication, getHealth, getToggle, postApplication } from './router'

const buildApp = (withRouter?: (router: Router) => void): Koa => {
  const app = new Koa()
  const router = new Router()

  app.use(bodyParser())

  router.use(onError)
  router
    .get('/health', getHealth)
    .get('/toggle', getToggle)
    .post('/application', postApplication)
    .delete('/application/:id', deleteApplication)

  if (withRouter) {
    withRouter(router)
  }

  app.use(router.routes())

  return app
}

const app = buildApp()

export { app, buildApp }
