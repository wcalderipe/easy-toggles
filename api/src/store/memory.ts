import * as Loki from 'lokijs'
import { omit } from 'ramda'
import { Query, Store } from './type'

const database = new Loki('')
const collection = database.addCollection('Application', { indices: ['id'] })
const documents: any[] = [
  {
    features: [
      {
        criterias: [{ name: 'country', values: ['BR', 'CL'] }],
        name: 'foo'
      },
      {
        criterias: [{ name: 'country', values: ['AR'] }],
        name: 'bar'
      }
    ],
    id: 'fooapp-fake-id',
    name: 'FooApp'
  }
]

collection.insert(documents)

const setDocuments = (docs: any[]): void => {
  collection.clear()
  collection.insert(docs)
}

const find = (query: Query): Promise<any[]> => {
  const results: any[] = collection.find(query)

  return Promise.resolve(results.map(omitLokiAttributes))
}

const save = (document: any): Promise<any> => {
  collection.insert(document)

  return Promise.resolve(omitLokiAttributes({ ...document }))
}

const destroy = (query: Query): Promise<boolean> => {
  const document: any | null = collection.findOne(query)

  if (!document) {
    return Promise.resolve(false)
  }

  collection.remove(document)

  return Promise.resolve(true)
}

const update = (query: Query, data: any): Promise<any> => {
  // TODO: Handle not found documents
  const document: any | null = collection.findOne(query)
  const updatedDocument: any = {
    ...document,
    ...data
  }

  collection.update(updatedDocument)

  // TODO: Test the return of the document updated state
  return Promise.resolve(omitLokiAttributes(updatedDocument))
}

const omitLokiAttributes = omit(['meta', '$loki'])

const store: Store = {
  destroy,
  find,
  save,
  update
}

export { store, setDocuments }
