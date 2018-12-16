import * as Loki from 'lokijs'
import { omit } from 'ramda'
import { Document, Query, Store } from './type'
import { withID } from './withID'

const database = new Loki('')
const collection = database.addCollection('Application', { indices: ['id'] })
const documents: Document[] = [
  {
    features: [
      {
        criterias: [
          { name: 'country', values: ['BR', 'CL'] }
        ],
        name: 'foo'
      },
      {
        criterias: [
          { name: 'country', values: ['AR'] }
        ],
        name: 'bar'
      }
    ],
    id: 'fooapp-fake-id',
    name: 'FooApp'
  }
]

collection.insert(documents)

const setDocuments = (docs: Document[]): void => {
  collection.clear()
  collection.insert(docs)
}

const find = (query: Query): Promise<any[]> => {
  const results: any[] = collection.find(query)

  return Promise.resolve(results.map(omitLokiAttributes))
}

const save = (document: any): Promise<any> => {
  const documentWithID: Document = withID(document)

  collection.insert(documentWithID)

  return Promise.resolve(omitLokiAttributes({ ...documentWithID }))
}

const destroy = (query: Query): Promise<boolean> => {
  const document: Document | null = collection.findOne(query)

  if (!document) {
    return Promise.resolve(false)
  }

  collection.remove(document)

  return Promise.resolve(true)
}

const update = (query: Query, data: any): Promise<any> => {
  // TODO: Handle not found documents
  const document: Document | null = collection.findOne(query)
  const updatedDocument: Document = {
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
