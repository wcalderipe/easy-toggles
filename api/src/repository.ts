import { curry, map } from 'ramda'
import * as uuid from 'uuid/v4'
import { ApplicationNotFound } from './domain/error'
import { Application } from './domain/type'
import { Store } from './store/type'

export const fakeStore: Store = {
  destroy: (query: any) => Promise.resolve(false),
  find: (query: any) => Promise.resolve([]),
  save: (document: any) => Promise.resolve(null),
  update: (query: any, data: any) => Promise.resolve({})
}

export const findApplicationById = curry(
  async (store: Store, id: string): Promise<Application> => {
    const results = await store.find({ id })

    if (results.length === 0) {
      throw new ApplicationNotFound()
    }

    return results[0] as Application
  }
)

// TODO: Receive withIds as an argument and remove the external side-effect
export const saveApplication = curry(
  async (store: Store, application: Application): Promise<Application> => await store.save(withIds(withId, application))
)

export const withId = <T>(object: T): T => Object.assign(object, { id: uuid() })

export const withIds = curry(
  (withId: any, application: Application): Application => {
    return {
      ...withId(application),
      features: map((feature) => {
        return {
          ...withId(feature),
          criterias: map((criteria) => withId(criteria), feature.criterias)
        }
      }, application.features)
    }
  }
)

export const deleteApplicationById = curry(
  async (store: Store, id: string): Promise<boolean> => {
    const isDeleted: boolean = await store.destroy({ id })

    if (!isDeleted) {
      throw new ApplicationNotFound()
    }

    return true
  }
)

export const updateApplicationById = curry(
  async (store: Store, id: string, data: Partial<Application>): Promise<Application> => await store.update({ id }, data)
)
