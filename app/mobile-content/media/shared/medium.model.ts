import { statusType, statusTypeForSearch } from '../../shared/status.model';

export type mediaType = 'audio' | 'image';
export type mediaTypeForSearch = 'ALL' | mediaType ;

export class Medium {
  public static readonly types = ['audio', 'image'];

  // Server-assigned properties. Cannot be modified on client side.
  public id = -1;
  public timestamp = -1;

  constructor(public title = '',
              public description = '',
              public type: mediaType = 'image',
              public status: statusType = 'DRAFT',
              public used = false) {}

  public static getRandom() {
    return new Medium(
      'Media File No. ' + (Math.random() * 100).toFixed(0),
      'Bla' + ' bla'.repeat(Math.round(Math.random() * 15)),
      Math.random() > 0.5 ? 'image' : 'audio',
      'DRAFT',
      Math.random() > 0.5
    );
  }
}

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
  status: statusTypeForSearch;
  timestamp: Date;

  constructor(exclude?: number[],
              includeOnly?: number[],
              page?: number,
              pageSize?: number,
              orderBy?: string,
              query?: string,
              status?: statusTypeForSearch,
              timestamp?: Date) {
    this.exclude = exclude;
    this.includeOnly = includeOnly;
    this.page = page;
    this.pageSize = pageSize;
    this.orderBy = orderBy;
    this.query = query;
    this.status = status;
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

export class SearchMediaArguments extends SearchArgumentsBase {

  type: mediaTypeForSearch;

  constructor(exclude?: number[],
              includeOnly?: number[],
              page?: number,
              pageSize?: number,
              orderBy?: string,
              query?: string,
              status?: statusTypeForSearch,
              type?: mediaTypeForSearch,
              timestamp?: Date) {
    super(exclude, includeOnly, page, pageSize, orderBy, query, status, timestamp);
    this.type = type;
  }
}

export class ServerError {
  statusCode: number;
  errorsInfo: ErrorMessage[];

  constructor(statusCode = 0, errorsInfo: ErrorMessage[] = new Array<ErrorMessage>()) {
    this.statusCode = statusCode;
    this.errorsInfo = errorsInfo;
  }

  toString(): string {
    let strRet = '';
    for (let error of this.errorsInfo) {
      strRet += ` ${error.key}   :    ${error.message} `;
    }
    return strRet;
  }
}

export class ErrorMessage {
  key: string;
  message: string;

  constructor(key = '', message = '') {
    this.key = key;
    this.message = message;
  }

  static getErrorMessages(errorsInfo?: any): ErrorMessage[] {
    let array = new Array<ErrorMessage>();
    if (!errorsInfo) {
      return array;
    }
    for (let errorKey in errorsInfo) {
      if (errorsInfo.hasOwnProperty(errorKey)) {
        array.push(new ErrorMessage(errorKey, errorsInfo[errorKey]));
      }
    }
    return array;
  }
}

