export const productTypeDefs = `
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String!
  }

  input ProductInput {
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String!
  }

  extend type Query {
    getProducts: [Product!]!
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product!
  }
`;
