import { curry, equals, pipe, reduce, where } from 'ramda'
import * as uuid from 'uuid/v4'
import { Store } from './type'

let documents: object[] = [
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

const getDocuments = (): object[] => documents
const setDocuments = (docs: object[]): void => {
  documents = docs
}

const find = (query: any): Promise<any[]> => {
  const results: any[] = documents.filter(queryMatcher(query))

  return Promise.resolve(results)
}

const queryMatcher = curry((query: object, document: any) => {
  return where(buildQueryPredicate(query), document)
})

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

const destroy = (query: any): Promise<number> => {
  interface Reduction {
    deleteCount: number
    documents: object[]
  }

  const accumulator: Reduction = { deleteCount: 0, documents: [] }

  const result: Reduction = documents.reduce((accumulator: Reduction, document: object) => {
    if (!queryMatcher(query, document)) {
      return {
        ...accumulator,
        documents: [
          ...accumulator.documents,
          document
        ]
      }
    }

    const deleteCount: number = accumulator.deleteCount + 1

    return {
      ...accumulator,
      deleteCount
    }
  }, accumulator)

  setDocuments(result.documents)

  return Promise.resolve(result.deleteCount)
}

const store: Store = { destroy, find, save }

export { store, getDocuments, setDocuments }
