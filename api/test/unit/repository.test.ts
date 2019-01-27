import { ApplicationNotFound } from '../../src/domain/error'
import { Application } from '../../src/domain/type'
import { deleteApplicationById, findApplicationById, saveApplication, withId, withIds } from '../../src/repository'
import { Store } from '../../src/store/type'

describe('repository', () => {
  const fakeStore: Store = {
    destroy: (query: any) => Promise.resolve(false),
    find: (query: any) => Promise.resolve([]),
    save: (document: any) => Promise.resolve(null),
    update: (query: any, data: any) => Promise.resolve({})
  }

  const fooApplication: Application = {
    name: 'FooApp',
    features: [
      {
        criterias: [{ name: 'country', values: ['AU'] }],
        name: 'foo'
      }
    ]
  }

  describe('findApplicationById', () => {
    test('throws ApplicationNotFound error when application does not exists', async () => {
      await expect(findApplicationById(fakeStore, 'banana-app')).rejects.toThrowError(ApplicationNotFound)
    })
  })

  describe('deleteApplicationById', () => {
    test('throws ApplicationNotFound error when application does not exists', async () => {
      await expect(deleteApplicationById(fakeStore, 'banana-app')).rejects.toThrowError(ApplicationNotFound)
    })
  })

  describe('withId', () => {
    test('adds id key to a given object', () => {
      const expectedUniqIdPattern = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      const object = { name: 'enhance me, babe' }
      const objectWithId = withId(object)

      expect(objectWithId).toMatchObject({
        id: expect.stringMatching(expectedUniqIdPattern),
        name: 'enhance me, babe'
      })
    })
  })

  describe('withIds', () => {
    test('adds id keys to a given application nested features and criterias', () => {
      const fakeWithId = (object: any) => ({ ...object, id: 'fake-id' })
      const actualApplication: Application = withIds(fakeWithId, fooApplication)

      expect(actualApplication).toEqual({
        id: 'fake-id',
        name: 'FooApp',
        features: [
          {
            id: 'fake-id',
            criterias: [{ id: 'fake-id', name: 'country', values: ['AU'] }],
            name: 'foo'
          }
        ]
      })
    })
  })

  describe('saveApplication', () => {
    test('adds ids before call store', async () => {
      const mockStore: Store = {
        ...fakeStore,
        save: jest.fn().mockImplementation(() => Promise.resolve({}))
      }

      await saveApplication(mockStore, fooApplication)

      expect(mockStore.save).toBeCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          features: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              criterias: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String)
                })
              ])
            })
          ])
        })
      )
    })
  })
})
