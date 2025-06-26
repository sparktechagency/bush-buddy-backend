/* eslint-disable @typescript-eslint/no-explicit-any */

import { Service } from "./service.model";

export const ServiceResolvers = {
  Query: {
    getServices: async () => await Service.find({}),
  },
  Mutation: {
    createService: async (_: any, { input }: any) => {
      const serviceInstance = new Service(input);
      return serviceInstance.save();
    },
  },
};
