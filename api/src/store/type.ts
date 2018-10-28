export interface Store {
  find: (query: any) => Promise<any[]>
  save: (document: any) => Promise<any>
  destroy: (query: any) => Promise<number>
}
