import { fromPairs, map, pipe } from 'ramda'
import { evaluate } from './evaluate'

import { Feature, Given, Toggles } from './types'

type ToggleTuple = [string, boolean]

const toggles = (features: Feature[], given: Given): Toggles => {
  const toggles = pipe(
    map(buildToggleTuple(given)),
    fromToggleTuples
  )(features)

  return toggles
}

const buildToggleTuple = (given: Given) => (feature: Feature): ToggleTuple => {
  return [feature.name, evaluate(feature, given)]
}

const fromToggleTuples = (tuples: ToggleTuple[]): Toggles => fromPairs(tuples)

export { toggles }
