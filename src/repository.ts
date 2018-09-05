import { find, propEq } from 'ramda'
import { Application } from './domain/types'

const findApplicationByName = (name: string, applications: Application[]): Application | undefined =>
  find(propEq('name', name), applications)

export { findApplicationByName }
