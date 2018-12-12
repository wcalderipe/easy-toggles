import { Application, Criteria, Feature } from './domain/type'
import { findApplicationById, saveApplication } from './repository'
import { Store } from './store/type'

const application = (store: Store) => async (source: any, context: any): Promise<Application> =>
  await findApplicationById(context.id, store)

const createApplication = (store: Store) => async (source: any, context: any): Promise<Application> => {
  const { input } = context
  const application: Application = buildApplication(input)

  return await saveApplication(application, store)
}

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

export { application, createApplication }
