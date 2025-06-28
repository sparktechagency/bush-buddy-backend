import { mergeTypeDefs } from "@graphql-tools/merge";
import { baseTypeDefs } from "../baseTypeDefs";

export const typeDefs = mergeTypeDefs([baseTypeDefs]);
