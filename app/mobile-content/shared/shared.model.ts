export class AllEntities<T> {

  constructor(public total: number,
              public entities: T[]) {
  }
}

export class SearchArgumentsBase {

  exclude: number[];
  includeOnly: number[];
  page: number;
  pageSize: number;
  orderBy: string;
  query: string;
  timestamp: Date;

  constructor(exclude?: number[],
              includeOnly?: number[],
              page?: number,
              pageSize?: number,
              orderBy?: string,
              query?: string,
              timestamp?: Date) {
    this.exclude = exclude;
    this.includeOnly = includeOnly;
    this.page = page;
    this.pageSize = pageSize;
    this.orderBy = orderBy;
    this.query = query;
    this.timestamp = timestamp;
  }

  toString() {
    let retVal = '';
    for (let [key, value] of (<any>Object).entries(this)) {
      if (this[key]) {
        retVal += `${key}=${value}&`;
      }
    }
    return retVal;
  }
}