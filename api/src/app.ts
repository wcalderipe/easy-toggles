import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import { onError } from './middleware'
import { getHealth, getToggles, postApplication } from './router'

const buildApp = (withRouter?: (router: Router) => void): Koa => {
  const app = new Koa()
  const router = new Router()

  app.use(bodyParser())

  router.use(onError)
  router.get('/health', getHealth)
  router.get('/toggles', getToggles)
  router.post('/applications', postApplication)

  if (withRouter) {
    withRouter(router)
  }

  app.use(router.routes())

  return app
}

const app = buildApp()

export { app, buildApp }
