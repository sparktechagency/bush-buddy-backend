import { mergeResolvers } from "@graphql-tools/merge";
import { productResolvers } from "../../app/modules/contextual/product/product.resolver";

export const resolvers = mergeResolvers([productResolvers]);
