/* eslint-disable @typescript-eslint/no-explicit-any */

import { Product } from "./product.model";

export const productResolvers = {
  Query: {
    getProducts: async () => await Product.find({}),
  },
  Mutation: {
    createProduct: async (_: any, { input }: any) => {
      const product = new Product(input);
      return product.save();
    },
  },
};
