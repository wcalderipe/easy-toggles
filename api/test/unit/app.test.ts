import { buildApp } from '../../src/app'

describe('app', () => {
  test('throws error if an unsupported store type was given', () => {
    process.env.EASY_TOGGLES_STORE_TYPE = 'space-store'

    expect(() => { buildApp() }).toThrow('Unsupported store type')

    delete process.env.EASY_TOGGLES_STORE_TYPE
  })
})
