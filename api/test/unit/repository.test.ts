import { ApplicationNotFound } from '../../src/domain/error'
import { findApplicationByName } from '../../src/repository'
import { Store } from '../../src/store/type'

describe('repository', () => {
  test('throws ApplicationNotFound error when application does not exists', async () => {
    const fakeStore: Store = {
      find: (query: any) => Promise.resolve([]),
      save: (document: any) => null
    }

    await expect(findApplicationByName('BananaApp', fakeStore)).rejects.toThrowError(ApplicationNotFound)
  })
})
