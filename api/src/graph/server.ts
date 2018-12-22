import { ApolloServer, IResolvers } from 'apollo-server-koa'
import { Store } from '../store/type'
import * as resolver from './resolver'
import { typeDefs } from './schema'

interface Context {
  store: Store
}

const buildGraphServer = (store: Store): ApolloServer => {
  const resolvers: IResolvers = {
    Query: {
      application: resolver.application,
      toggle: resolver.toggle
    },
    Mutation: {
      createApplication: resolver.createApplication,
      updateApplication: resolver.updateApplication,
      deleteApplication: resolver.deleteApplication
    }
  }

  const context = (): Context => ({
    store
  })

  const server: ApolloServer = new ApolloServer({
    context,
    resolvers,
    typeDefs
  })

  return server
}

export { buildGraphServer, Context }
