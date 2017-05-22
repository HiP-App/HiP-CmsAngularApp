import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { DataStoreApiService } from '../../shared/api/datastore-api.service';
import { Route } from './shared/route.model';

@Injectable()
export class RouteService {
    private routeCache: BehaviorSubject<Route[]> = new BehaviorSubject([]);
    public tags = this.routeCache.asObservable();

    constructor(private dataStoreApiService: DataStoreApiService) {}
    createRoute(route: Route): Promise<number> {
        console.log(JSON.stringify(route));
        return this.dataStoreApiService.postUrl('/api/Routes', JSON.stringify(route), {})
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
    public deleteTopic(id: number) {
        return this.dataStoreApiService.deleteUrl('/api/Route/' + id, {})
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
     * @param query Additional query to look for in topic title and description.
     * @param status Only return routes with specified status.
     */
    getAllRoutes(page: number, pageSize: number, orderBy = 'id', status = 'ALL', query = ''){
        let searchParams = '';
        searchParams += '?Page=' + page +
            '&PageSize=' + pageSize +
            '&OrderBy=' + orderBy +
            '&Status=' + status;
        return this.dataStoreApiService.getUrl('/api/Routes' + searchParams, {})
            .toPromise()
            .then(
                response => {
                    return {
                        items: Route.extractPaginatedArrayData(response),
                        metadata: response.json().metadata
                    };
                }
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    getRoute(id: number): Promise<Route> {
        return this.dataStoreApiService.getUrl('/api/Routes/' + id, {})
            .toPromise()
            .then(
                (response: Response) => Route.extractRoute(response)
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    updateRoute(tag: Route): Promise<Response> {
        return this.dataStoreApiService.putUrl('/api/Routes' + tag.id, JSON.stringify(tag), {})
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
        console.log(error);
        let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Promise.reject(errMsg);
    }
}
