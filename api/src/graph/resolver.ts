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
): Promise<Application> => await findApplicationById(id, store)

const deleteApplication = async (
  source: any,
  { id }: any,
  { store }: Context
): Promise<boolean> => await deleteApplicationById(id, store)

const createApplication = async (
  source: any,
  { input }: any,
  { store }: Context
): Promise<Application> => await saveApplication(input, store)

const updateApplication = async (
  source: any,
  { id, input }: any,
  { store }: Context
): Promise<Application> => await updateApplicationById(id, input, store)

export { application, createApplication, deleteApplication, updateApplication }
