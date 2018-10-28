import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import { onError } from './middleware'
import { getHealth, getToggle, postApplication } from './router'

const buildApp = (withRouter?: (router: Router) => void): Koa => {
  const app = new Koa()
  const router = new Router()

  app.use(bodyParser())

  router.use(onError)
  router.get('/health', getHealth)
  router.get('/toggle', getToggle)
  router.post('/application', postApplication)

  if (withRouter) {
    withRouter(router)
  }

  app.use(router.routes())

  return app
}

const app = buildApp()

export { app, buildApp }
