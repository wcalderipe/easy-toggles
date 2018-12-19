import { all, contains, equals, map, pipe, prop } from 'ramda'
import { Context, Criteria, Feature } from './type'

const evaluate = ({ criterias }: Feature, context: Context): boolean => {
  const isActive = pipe(
    map(isPresent(context)),
    all(equals(true))
  )(criterias)

  return isActive
}

const isPresent = (context: Context) => ({ name, values }: Criteria): boolean => contains(prop(name, context), values)

export { evaluate }
