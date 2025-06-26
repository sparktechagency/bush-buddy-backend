const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
};

export const paginationFields = ["page", "limit", "sort"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pickQuery = async (query: Record<string, any>) => {
  const paginationOptions = pick(query, paginationFields);
  const filters = Object.fromEntries(
    Object.entries(query).filter(
      ([key, value]) =>
        !paginationFields.includes(key) && value != null && value !== ""
    )
  );

  return {
    pagination: paginationOptions,
    filters,
  };
};

export default pickQuery;
