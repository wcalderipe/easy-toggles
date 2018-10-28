import { ApplicationNotFound } from '../../src/domain/error'
import { deleteApplicationById, findApplicationByName } from '../../src/repository'
import { Store } from '../../src/store/type'

const DELETED_APPLICATIONS = 0

describe('repository', () => {
  const fakeStore: Store = {
    destroy: (query: any) => Promise.resolve(DELETED_APPLICATIONS),
    find: (query: any) => Promise.resolve([]),
    save: (document: any) => Promise.resolve(null)
  }

  describe('findApplicationByName', () => {
    test('throws ApplicationNotFound error when application does not exists', async () => {
      await expect(findApplicationByName('BananaApp', fakeStore)).rejects.toThrowError(ApplicationNotFound)
    })
  })

  describe('deleteApplicationById', async () => {
    test('throws ApplicationNotFound error when application does not exists', async () => {
      await expect(deleteApplicationById('app-fake-id', fakeStore)).rejects.toThrowError(ApplicationNotFound)
    })
  })
})
