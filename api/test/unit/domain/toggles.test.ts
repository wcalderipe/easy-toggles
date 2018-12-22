import { toggles } from '../../../src/domain/toggles'
import { Context, Feature, Toggle } from '../../../src/domain/type'

describe('toggles', () => {
  const features: Feature[] = [
    {
      criterias: [{ name: 'country', values: ['BR', 'CL'] }],
      name: 'foo'
    },
    {
      criterias: [{ name: 'country', values: ['AR'] }],
      name: 'bar'
    }
  ]
  const context: Context = {
    country: 'BR'
  }

  test('returns toggles after evaluate a collection of features', () => {
    const expectedToggles: Toggle[] = [{ name: 'foo', isActive: true }, { name: 'bar', isActive: false }]

    expect(toggles(features, context)).toEqual(expectedToggles)
  })
})
