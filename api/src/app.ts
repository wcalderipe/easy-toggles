import * as Koa from 'koa'
import * as Router from 'koa-router'
import { onError } from './middleware'
import { getHealth, getToggles } from './router'

const buildApp = (withRouter?: (router: Router) => void): Koa => {
  const app = new Koa()
  const router = new Router()

  router.use(onError)

  router.get('/health', getHealth)
  router.get('/toggles', getToggles)

  if (withRouter) {
    withRouter(router)
  }

  app.use(router.routes())

  return app
}

const app = buildApp()

export { app, buildApp }
