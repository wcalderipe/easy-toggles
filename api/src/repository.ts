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

export { findApplicationByName, saveApplication }
