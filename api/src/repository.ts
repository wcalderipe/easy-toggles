import { ApplicationNotFound } from './domain/error'
import { Application } from './domain/type'
import { store as memoryStore } from './store/memory'
import { Store } from './store/type'

const findApplicationById = async (
  id: string,
  store: Store = memoryStore
): Promise<Application> => {
  const results = await store.find({ id })

  if (results.length === 0) {
    throw new ApplicationNotFound()
  }

  return results[0] as Application
}

const saveApplication = async (
  application: Application,
  store: Store = memoryStore
): Promise<Application> => {
  return (await store.save(application)) as Application
}

const deleteApplicationById = async (
  id: string,
  store: Store = memoryStore
): Promise<boolean> => {
  const isDeleted: boolean = await store.destroy({ id })

  if (!isDeleted) {
    throw new ApplicationNotFound()
  }

  return true
}

const updateApplicationById = async (
  id: string,
  data: Partial<Application>,
  store: Store = memoryStore
): Promise<Application> => {
  return await store.update({ id }, data)
}

export {
  deleteApplicationById,
  findApplicationById,
  saveApplication,
  updateApplicationById
}
