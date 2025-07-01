import QueryBuilder from "../../../core/builders/QueryBuilder";
import { IHunt } from "./hunt.interface";
import { Hunt } from "./hunt.model";

const createHunt = async (payload: IHunt) => {
  const result = await Hunt.create(payload);
  return result;
};

const getHunt = async (query: Record<string, unknown>) => {
  const huntQuery = new QueryBuilder(Hunt.find(), query)
    .search(["title"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await huntQuery.countTotal();
  const data = await huntQuery.modelQuery;

  return {
    meta,
    data,
  };
};

export const hunt_service = {
  createHunt,
  getHunt,
};
