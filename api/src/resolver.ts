import {
  Application,
  Criteria,
  Feature
} from './domain/type'
import {
  deleteApplicationById,
  findApplicationById,
  saveApplication
} from './repository'
import { Store } from './store/type'

const application = (store: Store) => async (source: any, { id }: any): Promise<Application> =>
  await findApplicationById(id, store)

const deleteApplication = (store: Store) => async (source: any, { id }: any): Promise<boolean> =>
  await deleteApplicationById(id, store)

const createApplication = (store: Store) => async (source: any, { input }: any): Promise<Application> =>
  await saveApplication(buildApplication(input), store)

interface FeatureInput {
  name: string
  criterias: [
    { name: string, values: string[] }
  ]
}

const buildApplication = (input: { name: string, features: FeatureInput[] }): Application => {
  return {
    ...input,
    features: input.features.map(mapFeatureInputToFeature)
  }
}

const mapFeatureInputToFeature = (feature: FeatureInput): Feature => {
  const reducer = (accumulator: Criteria, criteriaInput: { name: string, values: string[] }) => {
    return {
      ...accumulator,
      [criteriaInput.name]: criteriaInput.values
    }
  }

  const criteria = feature.criterias.reduce(reducer , {})

  return {
    name: feature.name,
    criteria
  }
}

export {
  application,
  createApplication,
  deleteApplication
}
