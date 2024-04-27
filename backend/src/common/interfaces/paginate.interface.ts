export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
  };
}

export type PaginateOptions = { skip?: number | string; take?: number | string };
export type PaginateFunction = <T, K>(model: any, args?: K, options?: PaginateOptions) => Promise<PaginatedResult<T>>;

export const paginator = (defaultOptions: PaginateOptions): PaginateFunction => {
  return async (model, args: any = { where: undefined }, options) => {
    const take = Number(options?.take || defaultOptions?.take) || 10;
    const skip = Number(options?.skip || defaultOptions?.skip) || 0;
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: take,
        skip,
      }),
    ]);

    return {
      data,
      meta: {
        total,
      },
    };
  };
};

export const rawPaginator = (defaultOptions: PaginateOptions): PaginateFunction => {
  return async (model, args: any = { where: undefined }, options) => {
    const take = Number(options?.take || defaultOptions?.take) || 10;
    const skip = Number(options?.skip || defaultOptions?.skip) || 0;
    const [total, data] = await Promise.all([
      model.aggregateRaw({
        pipeline: [
          ...args,
          {
            $count: "count",
          },
        ],
      }),
      model.aggregateRaw({
        pipeline: [
          ...args,
          {
            $skip: skip,
          },
          {
            $limit: take,
          },
        ],
      }),
    ]);

    return {
      data,
      meta: {
        total: total[0] ? total[0].count : 0,
      },
    };
  };
};
