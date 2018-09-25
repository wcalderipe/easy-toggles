import * as bodyParser from 'body-parser'
import * as express from 'express'
import { getToggles } from './router'

const buildApp = (withRoutes?: (app: express.Application) => void): express.Application => {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.get('/health', (req: express.Request, res: express.Response) => {
    return res.json({ up: true })
  })

  app.get('/toggles', getToggles)

  if (withRoutes) {
    withRoutes(app)
  }

  return app
}

const app = buildApp()

export { app, buildApp }
