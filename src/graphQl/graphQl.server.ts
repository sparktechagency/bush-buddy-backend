/* eslint-disable no-console */
import { ApolloServer } from "apollo-server-express";
import chalk from "chalk";
import { Express } from "express";
import { CONFIG } from "../app/core/config";
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";

export const initializeApolloServer = async (app: Express) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
  console.log(
    chalk.bgBlueBright.white(
      ` ⛳ GraphQL ready at http://${CONFIG.CORE.ip}:5002${server.graphqlPath} `
    )
  );
};
