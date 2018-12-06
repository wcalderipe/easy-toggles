import { setDocuments, store as memoryStore } from '../../../src/store/memory'
import { Query } from '../../../src/store/type'

describe('memory store', () => {
  beforeEach(() => {
    setDocuments([])
  })

  describe('find', () => {
    test('finds documents using the given query', async () => {
      setDocuments([
        { id: 'foo', name: 'foo' },
        { id: 'bar', name: 'bar' }
      ])

      const results: any[] = await memoryStore.find({ name: 'foo' })

      expect(results).toHaveLength(1)
      expect(results[0].name).toEqual('foo')
    })
  })

  describe('save', () => {
    test('saves a new document with an uuid id and returns the saved representation', async () => {
      await memoryStore.save({ name: 'foo' })

      const documents = await memoryStore.find({})

      expect(documents).toHaveLength(1)
    })

    test('returns the saved representation with an id as uuid', async () => {
      const uuidRegEx = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g

      const result: any = await memoryStore.save({ name: 'foo' })

      expect(result).toMatchObject({
        id: expect.stringMatching(uuidRegEx),
        name: 'foo'
      })
    })
  })

  describe('destroy', () => {
    test('deletes a document and resolve with true', async () => {
      await memoryStore.save({ name: 'foo' })

      const result: boolean = await memoryStore.destroy({ name: 'foo' })
      const documents = await memoryStore.find({})

      expect(documents).toHaveLength(0)
      expect(result).toEqual(true)
    })

    test('resolves with false when document is not found', async () => {
      await memoryStore.save({ name: 'foo' })

      const result: boolean = await memoryStore.destroy({ name: 'barfoo' })

      expect(result).toEqual(false)
    })
  })

  describe('update', () => {
    beforeEach(async () => {
      setDocuments([
        { id: 'foo', color: 'red' },
        { id: 'baz', color: 'blue' }
      ])
    })

    test('updates a document and resolve with the actual document state', async () => {
      const query: Query = { color: 'red' }
      const data: any = { color: 'yellow' }

      await memoryStore.update(query, data)
      const documents = await memoryStore.find({ color: 'yellow' })

      expect(documents).toHaveLength(1)
    })
  })
})
