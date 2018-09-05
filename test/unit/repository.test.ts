import { findApplicationByName } from '../../src/repository'

import { Application } from '../../src/domain/types'

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

  test('returns undefined when not found', () => {
    const applications: Application[] = []

    expect(findApplicationByName('BananaApp', applications)).toEqual(undefined)
  })
})
