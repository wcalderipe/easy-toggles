import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import { onError } from './middleware'
import { deleteApplication, getHealth, getToggle, postApplication } from './router'
import { store as memoryStore } from './store/memory'
import { Store } from './store/type'

const buildApp = (withRouter?: (router: Router) => void): Koa => {
  const storeType: string = process.env.EASY_TOGGLES_STORE_TYPE || 'memory'

  const app = new Koa()
  const router = new Router()
  const store: Store = getStore(storeType)

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

const getStore = (type: string): Store => {
  const stores: { [key: string]: Store } = {
    memory: memoryStore
  }

  if (!stores[type]) {
    throw new Error('Unsupported store type')
  }

  return stores[type]
}

const app = buildApp()

export { app, buildApp }
