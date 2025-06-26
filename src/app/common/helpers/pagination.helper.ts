type IOptions = {
  page?: number;
  limit?: number;
  sort?: string;
};

type IOptionResult = {
  page: number;
  limit: number;
  skip: number;
  sort: string;
};

const calculatePagination = (options: IOptions): IOptionResult => {
  // const page = Number(options?.page) || 1;
  // const limit = Number(options?.limit) || 10;
  // const skip = Number((page - 1) * limit);
  // const sort = options?.sort || "createdAt";

  const { page = 1, limit = 10, sort = "createdAt" } = options;

  return {
    page: Number(page),
    limit: Number(limit),
    skip: Number((page - 1) * limit),
    sort,
  };
};

export const paginationHelper = { calculatePagination };
