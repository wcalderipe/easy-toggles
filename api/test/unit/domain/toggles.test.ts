import { toggles } from '../../../src/domain/toggles'
import { Context, Feature, Toggles } from '../../../src/domain/type'

describe('toggles', () => {
  const features: Feature[] = [
    {
      criterias: [
        { name: 'country', values: ['BR', 'CL'] }
      ],
      name: 'newLoginForm'
    },
    {
      criterias: [
        { name: 'country', values: ['AR'] }
      ],
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
