export interface Store {
  find: (query: any) => Promise<any[]>
  save: (document: any) => any
}
