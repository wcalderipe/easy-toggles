import { ApolloServer, IResolvers } from 'apollo-server-koa'
import { Application, Criteria } from '../domain/type'
import {
  deleteApplicationById,
  findApplicationById,
  saveApplication,
  updateApplicationById,
  updateApplicationCriteria,
  UpdateApplicationCriteriaParams
} from '../repository'
import { Store } from '../store/type'
import * as resolver from './resolver'
import { typeDefs } from './schema'

interface Context {
  deleteApplicationById: (id: string) => Promise<boolean>
  findApplicationById: (id: string) => Promise<Application>
  saveApplication: (application: Application) => Promise<Application>
  updateApplicationById: (id: string, data: Partial<Application>) => Promise<Application>
  updateApplicationCriteria: (params: UpdateApplicationCriteriaParams) => Promise<Criteria>
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
      updateApplicationCriteria: resolver.updateApplicationCriteria,
      deleteApplication: resolver.deleteApplication
    }
  }

  const context = (): Context => ({
    deleteApplicationById: deleteApplicationById(store),
    findApplicationById: findApplicationById(store),
    saveApplication: saveApplication(store),
    updateApplicationById: updateApplicationById(store),
    updateApplicationCriteria: updateApplicationCriteria(store)
  })

  const server: ApolloServer = new ApolloServer({
    context,
    resolvers,
    typeDefs
  })

  return server
}

export { buildGraphServer, Context }
