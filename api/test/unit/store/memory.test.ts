import { documents, store as memoryStore } from '../../../src/store/memory'

describe('memory store', () => {
  describe('find', () => {
    test('finds documents using the given query', async () => {
      const query = { name: 'FooApp' }

      const results = await memoryStore.find(query)

      expect(results.length).toEqual(1)
      expect(results[0].name).toEqual('FooApp')
    })
  })

  describe('save', () => {
    test('saves a new document with an uuid id and returns the saved representation', async () => {
      const uuidRegEx = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      const document = {
        name: 'BarApp'
      }

      const result = await memoryStore.save(document)

      expect(documents.length).toEqual(2)
      expect(result).toMatchObject({
        id: expect.stringMatching(uuidRegEx),
        name: 'BarApp'
      })
    })
  })
})
