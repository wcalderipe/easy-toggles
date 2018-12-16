import { Context as KoaContext } from 'koa'
import { omit, prop } from 'ramda'
import { toggles } from './domain/toggles'
import { Application, Context } from './domain/type'
import { findApplicationById } from './repository'
import { Store } from './store/type'

const getToggle = (store: Store) => async (ctx: KoaContext) => {
  const context: Context = buildContext(ctx.query)
  const applicationId: string = prop('applicationId', ctx.query)
  const application: Application = await findApplicationById(applicationId, store)

  ctx.body = toggles(application.features, context)
}

const buildContext = omit(['application'])

const getHealth = async (ctx: KoaContext) => {
  ctx.body = { up: true }
}

export {
  getHealth,
  getToggle
}
