import { all, contains, equals, map, pipe, toPairs } from 'ramda'

import { Context, Feature } from './type'

type CriteriaTuple = [string, string[]]

const evaluate = (feature: Feature, context: Context): boolean => {
  const { criteria } = feature
  const criteriaTuples = toPairs(criteria)

  const isActive = pipe(
    map(isPresent(context)),
    all(equals(true))
  )(criteriaTuples)

  return isActive
}

const isPresent = (context: Context) => (criteria: CriteriaTuple): boolean => {
  const [ key, values ] = criteria
  const givenValue = context[key]

  return contains(givenValue, values)
}

export { evaluate }
