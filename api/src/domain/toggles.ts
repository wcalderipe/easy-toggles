import { map } from 'ramda'
import { evaluate } from './evaluate'
import { Context, Feature, Toggle } from './type'

const toggles = (features: Feature[], context: Context): Toggle[] => map(buildToggle(context), features)

const buildToggle = (context: Context) => (feature: Feature): Toggle => ({
  name: feature.name,
  isActive: evaluate(feature, context)
})

export { toggles }
