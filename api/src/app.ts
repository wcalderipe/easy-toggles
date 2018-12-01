import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import { onError } from './middleware'
import { deleteApplication, getHealth, getToggle, postApplication } from './router'
import { store as memoryStore } from './store/memory'
import { Store } from './store/type'

const buildApp = (withRouter?: (router: Router) => void): Koa => {
  const app = new Koa()
  const router = new Router()
  const store: Store = memoryStore

  app.use(bodyParser())

  router.use(onError)
  router
    .get('/health', getHealth)
    .get('/toggle', getToggle(store))
    .post('/application', postApplication(store))
    .delete('/application/:id', deleteApplication(store))

  if (withRouter) {
    withRouter(router)
  }

  app.use(router.routes())

  return app
}

const app = buildApp()

export { app, buildApp }
