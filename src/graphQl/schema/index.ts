import { mergeTypeDefs } from "@graphql-tools/merge";
import { baseTypeDefs } from "../baseTypeDefs";

import { productTypeDefs } from "../../app/modules/contextual/product/product.schema";

export const typeDefs = mergeTypeDefs([baseTypeDefs, productTypeDefs]);
