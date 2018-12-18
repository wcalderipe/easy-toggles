import { ApolloServer } from 'apollo-server-koa'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { buildGraphServer } from './graph/server'
import { onError } from './middleware'
import { getHealth, getToggle } from './router'
import { store as memoryStore } from './store/memory'
import { Store } from './store/type'

const buildApp = (withRouter?: (router: Router) => void): Koa => {
  const app = new Koa()
  const router = new Router()
  const store: Store = memoryStore

  router
    .use(onError)
    .get('/health', getHealth)
    .get('/toggle', getToggle(store))

  if (withRouter) {
    withRouter(router)
  }

  app.use(router.routes())

  const graphServer: ApolloServer = buildGraphServer(store)
  graphServer.applyMiddleware({ app })

  return app
}

const app = buildApp()

export { app, buildApp }
