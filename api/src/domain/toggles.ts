import { fromPairs, map, pipe } from 'ramda'
import { evaluate } from './evaluate'

import { Context, Feature, Toggles } from './type'

type ToggleTuple = [string, boolean]

const toggles = (features: Feature[], context: Context): Toggles => {
  const toggles = pipe(
    map(buildToggleTuple(context)),
    fromToggleTuples
  )(features)

  return toggles
}

const buildToggleTuple = (context: Context) => (
  feature: Feature
): ToggleTuple => {
  return [feature.name, evaluate(feature, context)]
}

const fromToggleTuples = (tuples: ToggleTuple[]): Toggles => fromPairs(tuples)

export { toggles }
