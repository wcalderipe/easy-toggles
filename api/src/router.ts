import { CREATED, NO_CONTENT } from 'http-status'
import { Context as KoaContext } from 'koa'
import { omit, prop } from 'ramda'
import { toggles } from './domain/toggles'
import { Application, Context } from './domain/type'
import { deleteApplicationById, findApplicationById, saveApplication } from './repository'
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

const postApplication = (store: Store) => async (ctx: KoaContext) => {
  const { body } = ctx.request
  const application: Application = await saveApplication(body as Application, store)

  ctx.status = CREATED
  ctx.body = application
}

const deleteApplication = (store: Store) => async (ctx: KoaContext) => {
  const { id } = ctx.params

  await deleteApplicationById(id, store)

  ctx.status = NO_CONTENT
}

export { deleteApplication, getToggle, getHealth, postApplication }
