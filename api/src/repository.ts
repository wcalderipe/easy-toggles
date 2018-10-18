import { find, propEq } from 'ramda'
import { ApplicationNotFound } from './domain/error'
import { Application } from './domain/types'

const findApplicationByName = (name: string, applications: Application[]): Application => {
  const application: Application | undefined = find(propEq('name', name), applications)

  if (!application) {
    throw new ApplicationNotFound()
  }

  return application
}

const saveApplication = (application: Application, applications: Application[]): Application => {
  applications.push(application)

  return application
}

export { findApplicationByName, saveApplication }
