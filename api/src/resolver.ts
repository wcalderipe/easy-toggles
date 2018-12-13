import { Application } from './domain/type'
import {
  deleteApplicationById,
  findApplicationById,
  saveApplication,
  updateApplicationById
} from './repository'
import { Store } from './store/type'

const application = (store: Store) => async (source: any, { id }: any): Promise<Application> =>
  await findApplicationById(id, store)

const deleteApplication = (store: Store) => async (source: any, { id }: any): Promise<boolean> =>
  await deleteApplicationById(id, store)

const createApplication = (store: Store) => async (source: any, { input }: any): Promise<Application> =>
  await saveApplication(input, store)

const updateApplication = (store: Store) => async (source: any, { id, input }: any): Promise<Application> =>
  await updateApplicationById(id, input, store)

export {
  application,
  createApplication,
  deleteApplication,
  updateApplication
}
