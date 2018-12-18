import { evaluate } from '../../../src/domain/evaluate'
import { Context, Feature } from '../../../src/domain/type'

describe('evaluate', () => {
  const feature: Feature = {
    criterias: [{ name: 'country', values: ['BR', 'CL'] }],
    name: 'newLoginForm'
  }

  test('returns true when context is present in the criteria', () => {
    const context: Context = {
      country: 'BR'
    }

    expect(evaluate(feature, context)).toEqual(true)
  })

  test('returns false when context is not present in the criteria', () => {
    const context: Context = {
      country: 'US'
    }

    expect(evaluate(feature, context)).toEqual(false)
  })

  describe('AND logical operator', () => {
    const feature: Feature = {
      criterias: [
        { name: 'fruit', values: ['apple', 'strawberry'] },
        { name: 'vegetable', values: ['potato', 'tomatoe'] }
      ],
      name: 'fooFeature'
    }

    test("returns false when context don't match all criterias", () => {
      const context: Context = {
        fruit: 'apple',
        vegetable: 'garlic'
      }

      expect(evaluate(feature, context)).toEqual(false)
    })

    test('returns true when context match all criterias', () => {
      const context: Context = {
        fruit: 'apple',
        vegetable: 'potato'
      }

      expect(evaluate(feature, context)).toEqual(true)
    })
  })
})
