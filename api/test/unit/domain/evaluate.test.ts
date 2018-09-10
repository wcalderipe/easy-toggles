import { evaluate } from '../../../src/domain/evaluate'

import { Context, Feature } from '../../../src/domain/types'

describe('evaluate', () => {
  const feature: Feature = {
    criteria: {
      country: ['BR', 'CL']
    },
    name: 'newLoginForm'
  }

  test('returns true when given is present in context', () => {
    const context: Context = {
      country: 'BR'
    }

    expect(evaluate(feature, context)).toEqual(true)
  })

  test('returns false when given is not present in context', () => {
    const context: Context = {
      country: 'US'
    }

    expect(evaluate(feature, context)).toEqual(false)
  })
})
