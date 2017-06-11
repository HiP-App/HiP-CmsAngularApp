import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';
import { Route } from './route.model';

@Injectable()
export class RouteService {
    private routeCache: BehaviorSubject<Route[]> = new BehaviorSubject([]);
    public tags = this.routeCache.asObservable();

    constructor(private mobileContentApiService: MobileContentApiService) {}
    createRoute(route: Route): Promise<number> {
        console.log(JSON.stringify(route));
        return this.mobileContentApiService.postUrl('/api/Routes', JSON.stringify(route), {})
            .toPromise()
            .then(
                (response: Response) => {
                    let newId = response.json().value as number;
                    let localRoutes = this.routeCache.getValue();

                    route.id = newId;
                    localRoutes.push(route);
                    localRoutes.sort(Route.routeAlphaCompare);
                    this.routeCache.next(localRoutes);

                    return newId;
                }
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    // DELETE

    /**
     * deletes a Route, identified by an id
     * @param id Id of the topic you want to be deleted
     * @returns {Promise<Response>} a Promise for the server response
     */
    public deleteRoute(id: number) {
        return this.mobileContentApiService.deleteUrl('/api/Routes/' + id, {})
            .toPromise()
            .catch(
                (error: any) => this.handleError(error)
            );
    }
    /**
     * Retrieves a subset of all routes based on supplied filter parameters.
     * Returns an object with two keys:
     * `items` an array of Topic objects that satisfy supplied search parameters and
     * `metadata` an object containing info on the returned subset (page number, total results, etc.)
     * @param page Page number for pagination.
     * @param pageSize Amount of users per page.
     * @param query Additional query to look for in topic title and description.∫
     * @param status Only return routes with specified status.
     */
    getAllRoutes(page: number, pageSize: number, status = 'ALL', query = '', orderBy = 'id') {
        let searchParams = '';
        searchParams += '?Page=' + page +
            '&PageSize=' + pageSize +
            '&OrderBy=' + orderBy +
            '&Status=' + status +
            '&query=' + query;
        return this.mobileContentApiService.getUrl('/api/Routes' + searchParams, {})
            .toPromise()
            .then(
                response => {
                    return {
                        items: Route.extractPaginatedArrayData(response),
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
    getRoute(id: number): Promise<Route> {
        return this.mobileContentApiService.getUrl('/api/Routes/' + id, {})
            .toPromise()
            .then(
                (response: Response) => Route.extractRoute(response)
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    updateRoute(tag: Route): Promise<Response> {
        return this.mobileContentApiService.putUrl('/api/Routes/' + tag.id, JSON.stringify(tag), {})
            .toPromise()
            .then(
                (response: Response) => {
                    let localRoutes = this.routeCache.getValue();
                    let tagToUpdate = localRoutes.find(item => item.id === tag.id);

                    for (let prop in tagToUpdate) {
                        if (tagToUpdate.hasOwnProperty(prop)) {
                            tagToUpdate[prop] = tag[prop];
                        }
                    }
                    this.routeCache.next(localRoutes);

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
