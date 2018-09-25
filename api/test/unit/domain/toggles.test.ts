import { toggles } from '../../../src/domain/toggles'

import { Context, Feature, Toggles } from '../../../src/domain/types'

describe('toggles', () => {
  const features: Feature[] = [
    {
      criteria: {
        country: ['BR', 'CL']
      },
      name: 'newLoginForm'
    },
    {
      criteria: {
        country: ['AR']
      },
      name: 'requireSomething'
    }
  ]
  const context: Context = {
    country: 'BR'
  }

  test('returns toggles after evaluate a collection of features', () => {
    const expectedToggles: Toggles = {
      newLoginForm: true,
      requireSomething: false
    }

    expect(toggles(features, context)).toEqual(expectedToggles)
  })
})