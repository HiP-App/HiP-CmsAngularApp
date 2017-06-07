import { statusTypeForSearch  } from '../status.model';
import { mediaTypeForSearch } from '../../media/shared/medium.model';

export class SearchArgsBase  {

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
            if (!this.IsUndefindedOrNull(value)) {
                retVal += `${key}=${value}&`;
            }
        }
        return retVal;
    }

    private IsUndefindedOrNull(obj: any): boolean {
        return  typeof(obj) === 'undefined' || obj === null;
    }
}

export class SearchMediaArgs extends SearchArgsBase {

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
