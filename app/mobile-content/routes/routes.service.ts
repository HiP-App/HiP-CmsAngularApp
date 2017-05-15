import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { DataStoreApiService } from '../../shared/api/datastore-api.service';
import { Route } from './route.model';
import { OOApiService } from '../../shared/api/oo-api.service';

@Injectable()
export class RouteService {
    private routeCache: BehaviorSubject<Route[]> = new BehaviorSubject([]);
    public tags = this.routeCache.asObservable();

    constructor(private dataStoreApiService: DataStoreApiService,
                private ooApiService: OOApiService) {
        this.getAllRoutes()
            .then(routes => this.routeCache.next(routes))
            .catch(error => this.routeCache.error(error));
    }
    createRoute(route: Route): Promise<number> {
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
    deleteRoute(id: number): Promise<Response> {
        return this.dataStoreApiService.deleteUrl('/api/Routes/' + id, {})
            .toPromise()
            .then(
                (response: Response) => {
                    // TODO: also delete the tag subtree!
                    let localRoutes = this.routeCache.getValue();
                    let deleteIndex = localRoutes.findIndex(route => route.id === id);

                    localRoutes.splice(deleteIndex, 1);
                    this.routeCache.next(localRoutes);

                    return response;
                }
            ).catch(
                (error: any) => this.handleError(error)
            );
    }
    getAllRoutes(onlyRoot = false, includeDeleted = false): Promise<Route[]> {
        return this.dataStoreApiService.getUrl('/api/Routes', {})
            .toPromise()
            .then(
                (response: Response) => Route.extractRouteArray(response).sort(Route.routeAlphaCompare)
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
        let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Promise.reject(errMsg);
    }
}
