import { ApolloError } from 'apollo-server-koa'
import { fromPairs, map, pipe } from 'ramda'
import { toggles } from '../domain/toggles'
import { Application, Context as GivenContext, Criteria, Toggle } from '../domain/type'
import { Context as ResolverContext } from './server'

export const application = async (
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

export const deleteApplication = async (
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

export const createApplication = async (
  source: any,
  { input }: any,
  { saveApplication }: ResolverContext
): Promise<Application> => await saveApplication(input)

export const updateApplication = async (
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

export const updateApplicationCriteria = async (
  source: any,
  { input }: any,
  { updateApplicationCriteria }: ResolverContext
): Promise<Criteria> => {
  try {
    const { applicationId, criteriaId, name, values } = input

    return await updateApplicationCriteria({
      applicationId,
      criteriaId,
      data: { name, values }
    })
  } catch (err) {
    // TODO: Besides application not found the function should raise a criteria not found as well
    throw buildNotFoundError(input.applicationId)
  }
}

export const toggle = async (
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
