import QueryBuilder from "../../../core/builders/QueryBuilder";
import { ITips } from "./tips.interface";
import { TipsAndTricks } from "./tips.model";

const createTips = async (payload: ITips) => {
  // sourcery skip: inline-immediately-returned-variable
  const result = await TipsAndTricks.create(payload);
  return result;
};

const getTips = async (query: Record<string, unknown>) => {
  const tipsQuery = new QueryBuilder(
    TipsAndTricks.find({ isDeleted: false }),
    query
  )
    .search(["title", "link", "platform"])
    .filter()
    .sort()
    .fields()
    .paginate();

  const meta = await tipsQuery.countTotal();
  const data = await tipsQuery.modelQuery;

  return {
    meta,
    data,
  };
};

export const tips_service = {
  createTips,
  getTips,
};
