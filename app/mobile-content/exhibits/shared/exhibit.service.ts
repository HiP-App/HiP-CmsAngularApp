import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';
import { Exhibit } from './exhibit.model';

@Injectable()
export class ExhibitService {
    private exhibitCache: BehaviorSubject<Exhibit[]> = new BehaviorSubject([]);
    public tags = this.exhibitCache.asObservable();

    constructor(private mobileContentApiService: MobileContentApiService) {}
    createExhibit(exhibit: Exhibit): Promise<number> {
        return this.mobileContentApiService.postUrl('/api/Exhibits', JSON.stringify(exhibit), {})
            .toPromise()
            .then(
                (response: Response) => {
                    let newId = response.json().value as number;
                    let localExhibits = this.exhibitCache.getValue();

                    exhibit.id = newId;
                    localExhibits.push(exhibit);
                    localExhibits.sort(Exhibit.exhibitAlphaCompare);
                    this.exhibitCache.next(localExhibits);

                    return newId;
                }
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    // DELETE

    /**
     * deletes a Exhibit, identified by an id
     * @param id Id of the topic you want to be deleted
     * @returns {Promise<Response>} a Promise for the server response
     */
    public deleteExhibit(id: number) {
        return this.mobileContentApiService.deleteUrl('/api/Exhibits/' + id, {})
            .toPromise()
            .catch(
                (error: any) => this.handleError(error)
            );
    }
    /**
     * Retrieves a subset of all exhibits based on supplied filter parameters.
     * Returns an object with two keys:
     * `items` an array of Topic objects that satisfy supplied search parameters and
     * `metadata` an object containing info on the returned subset (page number, total results, etc.)
     * @param page Page number for pagination.
     * @param pageSize Amount of users per page.
     * @param query Additional query to look for in topic title and description.∫
     * @param status Only return exhibits with specified status.
     */
    getAllExhibits(page: number, pageSize: number, status = 'ALL', query = '', orderBy = 'id') {
        let searchParams = '';
        searchParams += '?Page=' + page +
            '&PageSize=' + pageSize +
            '&OrderBy=' + orderBy +
            '&Status=' + status +
            '&query=' + query;
        return this.mobileContentApiService.getUrl('/api/Exhibits' + searchParams, {})
            .toPromise()
            .then(
                response => {
                    return {
                        items: Exhibit.extractPaginatedArrayData(response),
                        total: response.json().total
                    };
                }
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    getTagNames(ids: any): Promise<any> {
        let searchParams = '';
        searchParams += ids;
        return this.mobileContentApiService.getUrl('/api/Tags' + searchParams, {})
            .toPromise()
            .then(
                response => {
                    let returnValue = response.json();
                    return {
                        items: returnValue.items
                    };
                }
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    getExhibit(id: number): Promise<Exhibit> {
        return this.mobileContentApiService.getUrl('/api/Exhibits/' + id, {})
            .toPromise()
            .then(
                (response: Response) => Exhibit.extractExhibit(response)
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    updateExhibit(tag: Exhibit): Promise<Response> {
        return this.mobileContentApiService.putUrl('/api/Exhibits/' + tag.id, JSON.stringify(tag), {})
            .toPromise()
            .then(
                (response: Response) => {
                    let localExhibits = this.exhibitCache.getValue();
                    let tagToUpdate = localExhibits.find(item => item.id === tag.id);

                    for (let prop in tagToUpdate) {
                        if (tagToUpdate.hasOwnProperty(prop)) {
                            tagToUpdate[prop] = tag[prop];
                        }
                    }
                    this.exhibitCache.next(localExhibits);

                    return response;
                }
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    private handleError(error: any) {
        let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Promise.reject(errMsg);
    }
}
