import { getDocuments, setDocuments, store as memoryStore } from '../../../src/store/memory'

describe('memory store', () => {
  beforeEach(() => {
    setDocuments([])
  })

  describe('find', () => {
    test('finds documents using the given query', async () => {
      setDocuments([
        { name: 'FooApp' }
      ])

      const query = { name: 'FooApp' }

      const results: any[] = await memoryStore.find(query)

      expect(results).toHaveLength(1)
      expect(results[0].name).toEqual('FooApp')
    })
  })

  describe('save', () => {
    const document = {
      name: 'BarApp'
    }

    test('saves a new document with an uuid id and returns the saved representation', async () => {
      await memoryStore.save(document)

      expect(getDocuments()).toHaveLength(1)
    })

    test('returns the saved representation with an id as uuid', async () => {
      const uuidRegEx = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g

      const result: any = await memoryStore.save(document)

      expect(result).toMatchObject({
        id: expect.stringMatching(uuidRegEx),
        name: 'BarApp'
      })
    })
  })

  describe('destroy', () => {
    const document = {
      name: 'DeleteMe'
    }

    beforeAll(() => {
      setDocuments([])
    })

    test('deletes all documents that match the given query', async () => {
      await memoryStore.save(document)

      await memoryStore.destroy({ name: 'DeleteMe' })

      expect(getDocuments()).toHaveLength(0)
    })

    test('returns the number of deleted documents', async () => {
      await memoryStore.save(document)
      await memoryStore.save(document)

      const result: number = await memoryStore.destroy({ name: 'DeleteMe' })

      expect(result).toEqual(2)
    })
  })
})
