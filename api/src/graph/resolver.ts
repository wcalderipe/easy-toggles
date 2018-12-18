import { ApolloError } from 'apollo-server-koa'
import { Application } from '../domain/type'
import {
  deleteApplicationById,
  findApplicationById,
  saveApplication,
  updateApplicationById
} from '../repository'
import { Context } from './server'

const application = async (
  source: any,
  { id }: any,
  { store }: Context
): Promise<Application> => {
  try {
    return await findApplicationById(id, store)
  } catch (err) {
    throw buildNotFoundError(id)
  }
}

const deleteApplication = async (
  source: any,
  { id }: any,
  { store }: Context
): Promise<boolean> => {
  try {
    return await deleteApplicationById(id, store)
  } catch (err) {
    throw buildNotFoundError(id)
  }
}

const createApplication = async (
  source: any,
  { input }: any,
  { store }: Context
): Promise<Application> => await saveApplication(input, store)

const updateApplication = async (
  source: any,
  { id, input }: any,
  { store }: Context
): Promise<Application> => {
  try {
    return await updateApplicationById(id, input, store)
  } catch (err) {
    throw buildNotFoundError(id)
  }
}

const buildNotFoundError = (id: string) =>
  buildError({
    message: `Could not resolve to an Application with ID '${id}'.`,
    code: 'NOT_FOUND'
  })

const buildError = ({ message, code }: { message: string; code: string }) =>
  new ApolloError(message, code)

export { application, createApplication, deleteApplication, updateApplication }
