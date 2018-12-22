import { curry } from 'ramda'
import { ApplicationNotFound } from './domain/error'
import { Application } from './domain/type'
import { Store } from './store/type'

const findApplicationById = curry(async (store: Store, id: string) => {
  const results = await store.find({ id })

  if (results.length === 0) {
    throw new ApplicationNotFound()
  }

  return results[0] as Application
})

const saveApplication = curry(
  async (store: Store, application: Application): Promise<Application> => await store.save(application)
)

const deleteApplicationById = curry(
  async (store: Store, id: string): Promise<boolean> => {
    const isDeleted: boolean = await store.destroy({ id })

    if (!isDeleted) {
      throw new ApplicationNotFound()
    }

    return true
  }
)

const updateApplicationById = curry(
  async (store: Store, id: string, data: Partial<Application>): Promise<Application> => await store.update({ id }, data)
)

export { deleteApplicationById, findApplicationById, saveApplication, updateApplicationById }
