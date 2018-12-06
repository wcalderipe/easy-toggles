export interface Store {
  destroy: (query: Query) => Promise<boolean>
  find: (query: Query) => Promise<any[]>
  save: (document: any) => Promise<any>
  update: (query: Query, data: any) => Promise<any>
}

export interface Query {
  [key: string]: string
}

export interface Document {
  id: string,
  [key: string]: any
}
