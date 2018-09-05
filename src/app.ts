import * as bodyParser from 'body-parser'
import * as express from 'express'

const buildApp = (withRoutes?: (app: express.Application) => void): express.Application => {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.get('/health', (req: express.Request, res: express.Response) => {
    return res.json({ok: true})
  })

  if (withRoutes) {
    withRoutes(app)
  }

  return app
}

const app = buildApp()

export { app, buildApp }
