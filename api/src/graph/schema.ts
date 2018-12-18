import { gql } from 'apollo-server-koa'
import { DocumentNode } from 'graphql'

const typeDefs: DocumentNode = gql`
  type Application {
    id: ID!
    name: String!
    features: [Feature!]!
  }

  type Feature {
    name: String!
    criterias: [Criteria!]!
  }

  type Criteria {
    name: String!
    values: [String!]!
  }

  type Query {
    application(id: ID!): Application
  }

  input CreateApplicationInput {
    name: String!
    features: [CreateFeatureInput]!
  }

  input CreateFeatureInput {
    name: String!
    criterias: [CreateCriteriaInput]!
  }

  input CreateCriteriaInput {
    name: String!
    values: [String]!
  }

  input UpdateApplicationInput {
    name: String!
    features: [UpdateFeatureInput]!
  }

  input UpdateFeatureInput {
    name: String!
    criterias: [UpdateCriteriaInput]!
  }

  input UpdateCriteriaInput {
    name: String!
    values: [String]!
  }

  type Mutation {
    createApplication(input: CreateApplicationInput): Application
    updateApplication(id: ID!, input: UpdateApplicationInput): Application
    deleteApplication(id: ID!): Boolean
  }
`

export { typeDefs }
