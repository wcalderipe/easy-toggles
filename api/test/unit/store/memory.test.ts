import { setDocuments, store as memoryStore } from '../../../src/store/memory'
import { Document, Query } from '../../../src/store/type'

describe('memory store', () => {
  beforeEach(() => {
    setDocuments([])
  })

  describe('find', () => {
    beforeEach(() => {
      setDocuments([{ id: 'foo', name: 'foo' }, { id: 'bar', name: 'foo' }])
    })

    test('finds documents using the given query', async () => {
      const documents: any[] = await memoryStore.find({ id: 'foo' })

      expect(documents).toHaveLength(1)
      expect(documents[0].name).toEqual('foo')
    })

    test('omits lokidb attributes from all documents', async () => {
      const documents: any[] = await memoryStore.find({ name: 'foo' })

      documents.forEach((document) => {
        expect(document).not.toHaveProperty('meta')
        expect(document).not.toHaveProperty('$loki')
      })
    })
  })

  describe('save', () => {
    test('saves a new document with an uuid id and returns the saved representation', async () => {
      await memoryStore.save({ name: 'foo' })

      const documents = await memoryStore.find({})

      expect(documents).toHaveLength(1)
    })

    test('omits lokidb attributes', async () => {
      const document = await memoryStore.save({ name: 'foo' })

      expect(document).not.toHaveProperty('meta')
      expect(document).not.toHaveProperty('$loki')
    })
  })

  describe('destroy', () => {
    test('deletes a document and resolve with true', async () => {
      await memoryStore.save({ name: 'foo' })

      const isDeleted: boolean = await memoryStore.destroy({ name: 'foo' })
      const documents = await memoryStore.find({})

      expect(documents).toHaveLength(0)
      expect(isDeleted).toEqual(true)
    })

    test('resolves with false when document is not found', async () => {
      await memoryStore.save({ name: 'foo' })

      const isDeleted: boolean = await memoryStore.destroy({ name: 'barfoo' })

      expect(isDeleted).toEqual(false)
    })
  })

  describe('update', () => {
    beforeEach(async () => {
      setDocuments([{ id: 'foo', color: 'red' }, { id: 'baz', color: 'blue' }])
    })

    test('updates a document and resolve with the actual document state', async () => {
      const query: Query = { color: 'red' }
      const data: any = { color: 'yellow' }

      await memoryStore.update(query, data)
      const documents = await memoryStore.find({ color: 'yellow' })

      expect(documents).toHaveLength(1)
    })

    test('omits lokidb attributes', async () => {
      const query: Query = { color: 'red' }
      const data: any = { color: 'yellow' }

      const document: Document = await memoryStore.update(query, data)

      expect(document).not.toHaveProperty('meta')
      expect(document).not.toHaveProperty('$loki')
    })
  })
})
