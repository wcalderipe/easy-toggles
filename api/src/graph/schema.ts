import { gql } from 'apollo-server-koa'
import { DocumentNode } from 'graphql'

const typeDefs: DocumentNode = gql`
  type Application {
    id: ID!
    name: String!
    features: [Feature!]!
  }

  type Feature {
    id: ID!
    name: String!
    criterias: [Criteria!]!
  }

  type Criteria {
    id: ID!
    name: String!
    values: [String!]!
  }

  type Toggle {
    name: String!
    isActive: Boolean!
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

  input ContextInput {
    name: String!
    value: String!
  }

  type Query {
    application(id: ID!): Application
    toggle(applicationId: ID!, context: [ContextInput!]!): [Toggle]
  }

  type Mutation {
    createApplication(input: CreateApplicationInput): Application
    updateApplication(id: ID!, input: UpdateApplicationInput): Application
    deleteApplication(id: ID!): Boolean
  }
`

export { typeDefs }
