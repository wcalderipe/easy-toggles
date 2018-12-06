import { ApplicationNotFound } from '../../src/domain/error'
import { deleteApplicationById, findApplicationById } from '../../src/repository'
import { Store } from '../../src/store/type'

describe('repository', () => {
  const fakeStore: Store = {
    destroy: (query: any) => Promise.resolve(false),
    find: (query: any) => Promise.resolve([]),
    save: (document: any) => Promise.resolve(null),
    update: (query: any, data: any) => Promise.resolve({})
  }

  describe('findApplicationByName', () => {
    test('throws ApplicationNotFound error when application does not exists', async () => {
      await expect(findApplicationById('banana-app', fakeStore)).rejects.toThrowError(ApplicationNotFound)
    })
  })

  describe('deleteApplicationById', async () => {
    test('throws ApplicationNotFound error when application does not exists', async () => {
      await expect(deleteApplicationById('banana-app', fakeStore)).rejects.toThrowError(ApplicationNotFound)
    })
  })
})
