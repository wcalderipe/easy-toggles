import { findApplicationById } from './repository'
import { Store } from './store/type'

const application = (store: Store) =>  async (source: any, context: any) =>
  await findApplicationById(context.id, store)

export { application }
