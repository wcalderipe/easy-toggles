import { all, contains, equals, map, pipe, toPairs } from 'ramda'
import { Context, Feature, Given } from './types'

type ContextTuple = [string, string[]]

const evaluate = (feature: Feature, given: Given): boolean => {
  const { context } = feature
  const contextPairs = toPairs(context)

  const isActive = pipe(
    map(isPresent(given)),
    all(equals(true))
  )(contextPairs)

  return isActive
}

const isPresent = (given: Given) => (context: ContextTuple): boolean => {
  const [ key, values ] = context
  const givenValue = given[key]

  return contains(givenValue, values)
}

export { evaluate }
