import { evaluate } from '../../../src/domain/evaluate'
import { Feature, Given } from '../../../src/domain/types'

describe('evaluate', () => {
  const feature: Feature = {
    context: {
      country: ['BR', 'CL']
    },
    name: 'newLoginForm'
  }

  test('returns true when given is present in context', () => {
    const given: Given = {
      country: 'BR'
    }

    expect(evaluate(feature, given)).toEqual(true)
  })

  test('returns false when given is not present in context', () => {
    const given: Given = {
      country: 'US'
    }

    expect(evaluate(feature, given)).toEqual(false)
  })
})
