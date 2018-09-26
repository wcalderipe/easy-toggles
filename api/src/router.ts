import { Request, Response } from 'express'
import { NOT_FOUND } from 'http-status'
import { omit, prop } from 'ramda'
import { toggles } from './domain/toggles'
import { Application, Context } from './domain/types'
import { findApplicationByName } from './repository'

const dummyApplications: Application[] = [
  {
    features: [
      {
        criteria: {
          country: ['BR', 'CL']
        },
        name: 'foo'
      },
      {
        criteria: {
          country: ['AR']
        },
        name: 'bar'
      }
    ],
    name: 'FooApp'
  }
]

const getToggles = (req: Request, res: Response) => {
  const context: Context = buildContext(req.query)
  const applicationName: string = prop('application', req.query)
  const application: Application = findApplicationByName(applicationName, dummyApplications)

  return res.json(toggles(application.features, context))
}

const buildContext = omit(['application'])

export { getToggles }
