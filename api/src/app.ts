import { ApolloServer, gql, IResolvers } from 'apollo-server-koa'
import { DocumentNode } from 'graphql'
import * as GraphQLJSON from 'graphql-type-json'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import { onError } from './middleware'
import * as resolver from './resolver'
import {
  deleteApplication,
  getApplication,
  getHealth,
  getToggle,
  postApplication,
  updateApplication
} from './router'
import { store as memoryStore } from './store/memory'
import { Store } from './store/type'

const buildApolloServer = (store: Store): ApolloServer => {
  const typeDefs: DocumentNode = gql`
    scalar JSON

    type Application {
      id: ID!
      name: String!
      features: [Feature!]!
    }

    type Feature {
      name: String!
      criteria: JSON!
    }

    type Query {
      application(id: ID!): Application
    }

    input ApplicationInput {
      name: String!
      features: [FeatureInput]!
    }

    input FeatureInput {
      name: String!
      criterias: [CriteriaInput]!
    }

    input CriteriaInput {
      name: String!
      values: [String]!
    }

    type Mutation {
      createApplication(input: ApplicationInput): Application
      deleteApplication(id: ID!): Boolean
    }
  `

  const resolvers: IResolvers = {
    JSON: GraphQLJSON,
    Query: {
      application: resolver.application(store)
    },
    Mutation: {
      createApplication: resolver.createApplication(store),
      deleteApplication: resolver.deleteApplication(store)
    }
  }

  const server: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers
  })

  return server
}

const buildApp = (withRouter?: (router: Router) => void): Koa => {
  const app = new Koa()
  const router = new Router()
  const store: Store = memoryStore

  app.use(bodyParser())

  router.use(onError)
  router
    .get('/health', getHealth)
    .get('/toggle', getToggle(store))
    .get('/application/:id', getApplication(store))
    .post('/application', postApplication(store))
    .put('/application/:id', updateApplication(store))
    .delete('/application/:id', deleteApplication(store))

  if (withRouter) {
    withRouter(router)
  }

  app.use(router.routes())

  const apolloServer: ApolloServer = buildApolloServer(store)
  apolloServer.applyMiddleware({ app })

  return app
}

const app = buildApp()

export { app, buildApp }
