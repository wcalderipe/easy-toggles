import { equals, pipe, reduce, where } from 'ramda'
import { Store } from './index'

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
  documents.push(document)

  return Promise.resolve(document)
}

const store: Store = { find, save }

export { store, documents }
