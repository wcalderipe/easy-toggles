import { curry, map } from 'ramda'
import * as uuid from 'uuid/v4'
import { ApplicationNotFound, CriteriaNotFound } from './domain/error'
import { Application, Criteria, Feature } from './domain/type'
import { Store } from './store/type'

export const findApplicationById = curry(
  async (store: Store, id: string): Promise<Application> => {
    const results = await store.find({ id })

    if (results.length === 0) {
      throw new ApplicationNotFound()
    }

    return results[0] as Application
  }
)

export const saveApplication = curry(
  async (store: Store, application: Application): Promise<Application> => {
    return await store.save(withIds(withId, application))
  }
)

export const deleteApplicationById = curry(
  async (store: Store, id: string): Promise<boolean> => {
    const isDeleted: boolean = await store.destroy({ id })

    // TODO: Change the error due to the fact that something else could happen
    if (!isDeleted) {
      throw new ApplicationNotFound()
    }

    return true
  }
)

export const updateApplicationById = curry(
  async (store: Store, id: string, data: Partial<Application>): Promise<Application> => {
    try {
      return await store.update({ id }, data)
    } catch (err) {
      throw new ApplicationNotFound()
    }
  }
)

export interface UpdateApplicationCriteriaParams {
  applicationId: string
  criteriaId: string
  data: Criteria
}

export const updateApplicationCriteria = curry(
  async (store: Store, { applicationId, criteriaId, data }: UpdateApplicationCriteriaParams): Promise<Criteria> => {
    const application: Application = await findApplicationById(store, applicationId)

    let updatedCriteria: Criteria | undefined
    const updatedApplication: Application = {
      ...application,
      features: application.features.map((feature: Feature) => {
        return {
          ...feature,
          criterias: feature.criterias.map((criteria: Criteria) => {
            if (criteria.id !== criteriaId) {
              return criteria
            }

            updatedCriteria = { ...criteria, ...data }

            return { ...updatedCriteria }
          })
        }
      })
    }

    if (!updatedCriteria) {
      throw new CriteriaNotFound()
    }

    await updateApplicationById(store, applicationId, updatedApplication)

    return updatedCriteria
  }
)

export const withId = <T extends object>(object: T): T & { id: string } => Object.assign(object, { id: uuid() })

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
