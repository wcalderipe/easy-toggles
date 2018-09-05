import { toggles } from '../../../src/domain/toggles'

import { Feature, Given, Toggles } from '../../../src/domain/types'

describe('toggles', () => {
  const features: Feature[] = [
    {
      context: {
        country: ['BR', 'CL']
      },
      name: 'newLoginForm'
    },
    {
      context: {
        country: ['AR']
      },
      name: 'requireSomething'
    }
  ]
  const given: Given = {
    country: 'BR'
  }

  test('returns toggles after evaluate a collection of features', () => {
    const expectedToggles: Toggles = {
      newLoginForm: true,
      requireSomething: false
    }

    expect(toggles(features, given)).toEqual(expectedToggles)
  })
})
