import { CREATED } from 'http-status'
import { Context as KoaContext } from 'koa'
import { omit, prop } from 'ramda'
import { toggles } from './domain/toggles'
import { Application, Context } from './domain/type'
import { deleteApplicationById, findApplicationByName, saveApplication } from './repository'

const getToggle = async (ctx: KoaContext) => {
  const context: Context = buildContext(ctx.query)
  const applicationName: string = prop('application', ctx.query)
  const application: Application = await findApplicationByName(applicationName)

  ctx.body = toggles(application.features, context)
}

const buildContext = omit(['application'])

const getHealth = async (ctx: KoaContext) => {
  ctx.body = { up: true }
}

const postApplication = async (ctx: KoaContext) => {
  const { body } = ctx.request
  const application: Application = await saveApplication(body as Application)

  ctx.status = CREATED
  ctx.body = application
}

const deleteApplication = async (ctx: KoaContext) => {
  const { id } = ctx.params

  await deleteApplicationById(id)

  ctx.status = 204
}

export { deleteApplication, getToggle, getHealth, postApplication }
