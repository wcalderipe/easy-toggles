import { withID } from '../../../src/store/withID'

describe('withID', () => {
  test('adds an ID attribute to a given object', () => {
    const object = { name: 'holy grande' }
    const actualObject = withID(object)

    expect(actualObject).toHaveProperty('id')
    expect(actualObject.name).toEqual('holy grande')
  })
})
