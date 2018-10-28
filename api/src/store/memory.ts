import { equals, pipe, reduce, where } from 'ramda'
import * as uuid from 'uuid/v4'
import { Store } from './type'

const documents: object[] = [
  {
    features: [
      {
        criteria: {
          country: ['BR', 'CL']
        },
        name: 'foo'
      },
      {
        criteria: {
          country: ['AR']
        },
        name: 'bar'
      }
    ],
    id: 'fooapp-fake-uuid',
    name: 'FooApp'
  }
]

const find = (query: any): Promise<any[]> => {
  const results: any[] = documents.filter(filterByQuery(query))

  return Promise.resolve(results)
}

const filterByQuery = (query: object) => where(buildQueryPredicate(query))

const buildQueryPredicate = (query: any): object => {
  const buildPredicate = (prev: object, key: string) => {
    const value = query[key]

    return {
      ...prev,
      [key]: equals(value)
    }
  }

  const predicates = pipe(
    Object.keys,
    reduce(buildPredicate, {})
  )(query)

  return predicates
}

const save = (document: any): Promise<any> => {
  const ID_KEY = 'id'
  const documentCopy = { ...document }

  documentCopy[ID_KEY] = uuid()

  documents.push(documentCopy)

  return Promise.resolve({ ...documentCopy })
}

const store: Store = { find, save }

export { store, documents }
