import { Context as KoaContext } from 'koa'
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

const getToggles = async (ctx: KoaContext) => {
  const context: Context = buildContext(ctx.query)
  const applicationName: string = prop('application', ctx.query)
  const application: Application = findApplicationByName(applicationName, dummyApplications)

  ctx.body = toggles(application.features, context)
}

const buildContext = omit(['application'])

const getHealth = async (ctx: KoaContext) => {
  ctx.body = { up: true }
}

export { getToggles, getHealth }
