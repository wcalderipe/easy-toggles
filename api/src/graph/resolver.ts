import { ApolloError } from 'apollo-server-koa'
import { dissoc, fromPairs, map, pipe } from 'ramda'
import { ApiError } from '../domain/error'
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
    throw buildError(err)
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
    throw buildError(err)
  }
}

export const createApplication = async (
  source: any,
  { input }: any,
  { saveApplication }: ResolverContext
): Promise<Application> => await saveApplication(input)

export const updateApplication = async (
  source: any,
  { input }: any,
  { updateApplicationById }: ResolverContext
): Promise<Application> => {
  try {
    const { applicationId } = input
    const data: any = dissoc('applicationId', input)

    return await updateApplicationById(applicationId, data)
  } catch (err) {
    throw buildError(err)
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
    throw buildError(err)
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
    throw buildError(err)
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

// TODO: Improve error message
const buildError = ({ code }: ApiError) => new ApolloError(code, code)
