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
    test('saves a new document and returns the saved representation', async () => {
      const document = {
        name: 'BarApp'
      }

      const result = await memoryStore.save(document)

      expect(documents.length).toEqual(2)
      expect(result).toEqual(document)
    })
  })
})
