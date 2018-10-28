import { ApplicationNotFound } from './domain/error'
import { Application } from './domain/type'
import { store as memoryStore } from './store/memory'
import { Store } from './store/type'

const findApplicationByName = async (name: string, store: Store = memoryStore): Promise<Application> => {
  const results = await store.find({ name })

  if (results.length === 0) {
    throw new ApplicationNotFound()
  }

  return results[0] as Application
}

const saveApplication = async (application: Application, store: Store = memoryStore): Promise<Application> => {
  return await store.save(application) as Application
}

const deleteApplicationById = async (id: string, store: Store = memoryStore): Promise<boolean> => {
  const deleteCount: number = await memoryStore.destroy({ id })

  if (deleteCount === 0) {
    throw new ApplicationNotFound()
  }

  return true
}

export { findApplicationByName, saveApplication, deleteApplicationById }
