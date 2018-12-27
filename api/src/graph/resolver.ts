import { ApolloError } from 'apollo-server-koa'
import { fromPairs, map, pipe } from 'ramda'
import { toggles } from '../domain/toggles'
import { Application, Context as GivenContext, Toggle } from '../domain/type'
import { Context as ResolverContext } from './server'

const application = async (
  source: any,
  { id }: any,
  { findApplicationById }: ResolverContext
): Promise<Application> => {
  try {
    return await findApplicationById(id)
  } catch (err) {
    throw buildNotFoundError(id)
  }
}

const deleteApplication = async (
  source: any,
  { id }: any,
  { deleteApplicationById }: ResolverContext
): Promise<boolean> => {
  try {
    return await deleteApplicationById(id)
  } catch (err) {
    throw buildNotFoundError(id)
  }
}

const createApplication = async (
  source: any,
  { input }: any,
  { saveApplication }: ResolverContext
): Promise<Application> => await saveApplication(input)

const updateApplication = async (
  source: any,
  { id, input }: any,
  { updateApplicationById }: ResolverContext
): Promise<Application> => {
  try {
    return await updateApplicationById(id, input)
  } catch (err) {
    throw buildNotFoundError(id)
  }
}

const toggle = async (
  source: any,
  { applicationId, context }: any,
  { findApplicationById }: ResolverContext
): Promise<Toggle[]> => {
  try {
    const { features }: Application = await findApplicationById(applicationId)

    return toggles(features, transformContext(context))
  } catch (err) {
    throw buildNotFoundError(applicationId)
  }
}

interface InputContext {
  name: string
  value: string
}

const transformContext = (context: InputContext[]): GivenContext => {
  const buildNameValueTuple = ({ name, value }: InputContext): [string, string] => [name, value]
  const buildGivenContext = (tuples: Array<[string, string]>): GivenContext => fromPairs(tuples)

  return pipe(
    map(buildNameValueTuple),
    buildGivenContext
  )(context)
}

const buildNotFoundError = (id: string) =>
  buildError({
    message: `Could not resolve to an Application with ID '${id}'.`,
    code: 'NOT_FOUND'
  })

const buildError = ({ message, code }: { message: string; code: string }) => new ApolloError(message, code)

export { application, createApplication, deleteApplication, updateApplication, toggle }
