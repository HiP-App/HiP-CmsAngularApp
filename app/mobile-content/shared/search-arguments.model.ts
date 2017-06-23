export class SearchArguments {
  page: number;
  pageSize: number;
  orderBy: string;
  query: string;
  status: string;
  timestamp: Date;

  constructor(page?: number,
              pageSize?: number,
              orderBy?: string,
              query?: string,
              status?: string,
              timestamp?: Date) {
    this.page = page;
    this.pageSize = pageSize;
    this.orderBy = orderBy;
    this.query = query;
    this.status = status;
    this.timestamp = timestamp;
  }

  toString() {
    let retVal = '?';
    for (let [key, value] of (<any>Object).entries(this)) {
      if (this[key]) {
        retVal += `${key}=${value}&`;
      }
    }
    return retVal;
  }
}
