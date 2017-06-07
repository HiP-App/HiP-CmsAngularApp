import { Status  } from '../status.model';
import { MediaType } from '../mediaType.model';

export class SearchArgsBase  {

    exclude: number[];
    includeOnly: number[];
    page: number;
    pageSize: number;
    orderBy: string;
    query: string;
    _status: string;
    timestamp: Date;

    get status(): string {
        return this._status;
    }

    set status(str: string) {
     this._status = Status.getValuesForSearch().includes(str) ? str : undefined;
    }

    constructor(exclude?: number[],
                includeOnly?: number[],
                page?: number,
                pageSize?: number,
                orderBy?: string,
                query?: string,
                status?: string,
                timestamp?: Date) {
        this.exclude = exclude ;
        this.includeOnly = includeOnly;
        this.page = page ;
        this.pageSize = pageSize;
        this.orderBy  = orderBy;
        this.query = query;
        this.status = status;
        this.timestamp = timestamp;
    }

    toGetString() {
        let retVal = '';
        for (let [key, value] of (<any>Object).entries(this)) {
            if (!this.IsUndefindedOrNull(value))
                retVal += `${key.indexOf('_') === 0 ? key.substr(1) : key}=${value}&`;
        }
        return retVal;
    }

    private IsUndefindedOrNull(obj: any): boolean {
        return  typeof(obj) === 'undefined' || obj === null;
    }
}

export class SearchMediaArgs extends SearchArgsBase {

    _type: string;

    get type(): string {
        return this._type;
    }

    set type(str: string) {
        str = str.toUpperCase();
        this._type = MediaType.getValues().includes(str) ? str : undefined;
    }


    constructor(exclude?: number[],
                includeOnly?: number[],
                page?: number,
                pageSize?: number,
                orderBy?: string,
                query?: string,
                status?: string,
                type?: string,
                timestamp?: Date){
        super(exclude, includeOnly, page, pageSize, orderBy, query, status, timestamp);
        this.type = type;

    }

}
