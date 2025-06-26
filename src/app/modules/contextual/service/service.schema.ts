export const serviceTypeDefs = `
  type Service {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String!
  }

  input ServiceInput {
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String!
  }

  extend type Query {
    getServices: [Service!]!
  }

  extend type Mutation {
    createService(input: ServiceInput!): Service!
  }
`;
