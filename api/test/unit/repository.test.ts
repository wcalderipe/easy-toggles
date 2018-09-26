import { ApplicationNotFound } from '../../src/domain/error'
import { Application } from '../../src/domain/types'
import { findApplicationByName } from '../../src/repository'

describe('repository', () => {
  const fooApp: Application = {
    features: [],
    name: 'FooApp'
  }
  const barApp: Application = {
    features: [],
    name: 'BarApp'
  }

  test('finds application by name', () => {
    const applications: Application[] = [fooApp, barApp]
    const expectedApplication: Application = fooApp

    expect(findApplicationByName('FooApp', applications)).toEqual(expectedApplication)
  })

  test('throws ApplicationNotFound error', () => {
    const applications: Application[] = []
    const findInexistentApplication = () => {
      findApplicationByName('BananaApp', applications)
    }

    expect(findInexistentApplication).toThrowError(ApplicationNotFound)
  })
})
