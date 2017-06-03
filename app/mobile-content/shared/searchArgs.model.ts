import { Status } from './status.model';



export class SearchArgs  {

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
        for (let [key, value] of Object.entries(this)) {
            if (!this.IsUndefindedOrNull(value))
                retVal += `${key === '_status' ? 'status' : key}=${value}&`;
        }
        return retVal;
    }

    private IsUndefindedOrNull(obj: any): boolean
    {
        return  typeof(obj) === 'undefined' || obj === null;
    }


}
