import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, ResponseContentType, Headers, Response } from '@angular/http';

import { Achievement } from './achievement.model';
import { AchievementApiService } from '../../shared/achievement-api.service';
import { ExhibitsVisitedAchievement } from './exhibits-visited-achievement.model';
import { RouteFinishedAchievement } from './route-finished-achievement.model';




@Injectable()
export class AchievementService {
    private achievementCache: BehaviorSubject<Achievement[]> = new BehaviorSubject([]);

    constructor(private achievementApiService: AchievementApiService) { }

    // Create achievement service -> Exhibit visited achievement

    createExhibitVisitedAchievement(exhibitsVisitedAchievement: ExhibitsVisitedAchievement): Promise<number> {

        return this.achievementApiService.postUrl('/api/Achievements/ExhibitsVisited', JSON.stringify(exhibitsVisitedAchievement), {})
            .toPromise()
            .then(
            (response: any) => {

                let newId = response._body;
                let localAchievements = this.achievementCache.getValue();

                exhibitsVisitedAchievement.id = newId;
                localAchievements.push(exhibitsVisitedAchievement);
                localAchievements.sort(AchievementService.achievementAlphaCompare);
                this.achievementCache.next(localAchievements);

                return newId;
            })

            .catch(
            (error: any) => AchievementService.handleError(error)
            );
    }

    // Create achievement service -> Route Finished achievement

    createRouteFinishedAchievement(routeFinishedAchievement: RouteFinishedAchievement): Promise<number> {

        return this.achievementApiService.postUrl('/api/Achievements/RouteFinished', JSON.stringify(routeFinishedAchievement), {})
            .toPromise()
            .then(
            (response: any) => {
                let newId = response._body;
                let localAchievements = this.achievementCache.getValue();

                routeFinishedAchievement.id = newId;
                localAchievements.push(routeFinishedAchievement);
                localAchievements.sort(AchievementService.achievementAlphaCompare);
                this.achievementCache.next(localAchievements);

                return newId;
            })
            .catch(
            (error: any) => AchievementService.handleError(error)
            );
    }

    deleteAchievement(id: number) {
        return this.achievementApiService.deleteUrl('/api/Achievements/' + id, {})
            .toPromise()
            .catch(
            (error: any) => AchievementService.handleError(error)
            );
    }

    getAllAchievements(page: number, pageSize: number, status = 'ALL', type = '', query = '', orderBy = 'id', includeOnly: number[] = []) {
        if (type === 'ALL') {
            type = '';
        }

        let searchParams = '';
        searchParams += '?Page=' + page +
            '&PageSize=' + pageSize +
            '&OrderBy=' + orderBy +
            '&Status=' + status +
            '&TypeName=' + type +
            '&Query=' + encodeURIComponent(query) +
            includeOnly.reduce((prev, curr) => prev + '&IncludeOnly=' + curr, '');

        return this.achievementApiService.getUrl('/api/Achievements' + searchParams, {})
            .toPromise()
            .then(
            (response: Response) => {
                return {
                    items: AchievementService.extractPaginatedArrayData(response),
                    total: response.json().total
                };
            }
            )
            .catch(
            (error: any) => AchievementService.handleError(error)
            );
    }

    getAchievementTypes() {
        return this.achievementApiService.getUrl('/api/Achievements/types', {})
            .toPromise()
            .then(
            (response: Response) => {
                return response.json();
            }
            )
            .catch(
            (error: any) => AchievementService.handleError(error)
            );
    }

    getAchievement(id: number): Promise<Achievement> {
        return this.achievementApiService.getUrl('/api/Achievements/' + id, {})
            .toPromise()
            .then(
            (response: Response) => AchievementService.extractAchievement(response)
            )
            .catch(
            (error: any) => AchievementService.handleError(error)
            );
    }

    // Update service -> Exihibit visited achievement

    updateExhibitVisitedAchievement(exhibitsVisitedAchievement: ExhibitsVisitedAchievement): Promise<Response> {
        return this.achievementApiService.putUrl('/api/Achievements/ExhibitsVisited/' + exhibitsVisitedAchievement.id,
            JSON.stringify(exhibitsVisitedAchievement), {})
            .toPromise()
            .then(
            (response: Response) => {
                let localAchievements = this.achievementCache.getValue();
                let achievementToUpdate = localAchievements.find(item => item.id === exhibitsVisitedAchievement.id);

                for (let prop in achievementToUpdate) {
                    if (achievementToUpdate.hasOwnProperty(prop)) {
                        achievementToUpdate[prop] = exhibitsVisitedAchievement[prop];
                    }
                }

                this.achievementCache.next(localAchievements);

                return response;
            }
            )
            .catch(
            (error: any) => AchievementService.handleError(error)
            );
    }

    // Update service -> Route Finished achievement

    updateRouteFinishedAchievement(routeFinishedAchievement: RouteFinishedAchievement): Promise<Response> {
        return this.achievementApiService.putUrl('/api/Achievements/RouteFinished/' + routeFinishedAchievement.id,
            JSON.stringify(routeFinishedAchievement), {})
            .toPromise()
            .then(
            (response: Response) => {
                let localAchievements = this.achievementCache.getValue();
                let achievementToUpdate = localAchievements.find(item => item.id === routeFinishedAchievement.id);

                for (let prop in achievementToUpdate) {
                    if (achievementToUpdate.hasOwnProperty(prop)) {
                        achievementToUpdate[prop] = routeFinishedAchievement[prop];
                    }
                }

                this.achievementCache.next(localAchievements);

                return response;
            }
            )
            .catch(
            (error: any) => AchievementService.handleError(error)
            );
    }

    // Get picture service

    public getImage(id: number, viewImage: boolean): Promise<any> {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.ArrayBuffer });
        return this.achievementApiService.getUrl('/api/Image/' + id, options)
            .toPromise()
            .then(
            response => AchievementService.extractContent(response, viewImage)
            )
            .catch(
            (error: any) => this.handleError(error)
            );
    }

    // Upload picture service

    public uploadImage(fileToUpload: any, id: number) {
        let input = new FormData();
        input.append('file', fileToUpload);
        return this.achievementApiService.putUrlWithFormData('/api/Image/' + id, input)
            .toPromise()
            .then(
            (res: Response) => {
                return res;
            }
            )
            .catch(
            (error: any) => this.handleError(error)
            );
    }

    private handleError<T>(error: any) {
        let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Promise.reject<T>(Observable.throw(errMsg));
    }

    public static achievementAlphaCompare(a: Achievement, b: Achievement): number {
        return a.title.localeCompare(b.title);
    }

    static parseJSON(obj: any): Achievement {
        switch (obj.type) {
            case 'ExhibitsVisited':
                return new ExhibitsVisitedAchievement(
                    obj.id,
                    obj.title,
                    obj.description,
                    obj.points,
                    obj.type,
                    obj.status,
                    obj.count,
                    obj.thumbnailUrl,
                    obj.timestamp
                );
            case 'RouteFinished':
                return new RouteFinishedAchievement(
                    obj.id,
                    obj.title,
                    obj.description,
                    obj.points,
                    obj.type,
                    obj.status,
                    obj.routeId,
                    obj.thumbnailUrl,
                    obj.timestamp
                );
        }
    }

    private static extractContent(res: Response, viewImage: boolean) {
        let blob: Blob = res.blob();
        let mainHead = res.headers.get('content-disposition');
        let filename = mainHead.split(';')
            .map(x => x.trim())
            .map(
            s => {
                if (s.split('=')[0] === 'filename') {
                    return s.split('=')[1];
                }
            }
            ).filter(x => x)[0];
        let url = window.URL.createObjectURL(blob);
        if (viewImage) {
            return blob;
        } else {
            let a = document.createElement('a');
            a.href = url;
            a.download = typeof (filename) === 'string' ? filename : 'download';
            a.target = '_blank';
            a.click();
            a.remove();
        }
    }

    public static extractAchievement(response: Response): Achievement {
        let body = response.json();
        return AchievementService.parseJSON(body);
    }

    public static extractPaginatedArrayData(res: Response): Achievement[] {
        let body = res.json();
        let achievements: Achievement[] = [];

        if (body.items === undefined) {
            return achievements;
        }

        for (let achievement of body.items) {
            achievements.push(this.parseJSON(achievement));
        }

        return achievements || [];
    }

    private static handleError(error: any) {
        let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Promise.reject(errMsg);
    }
}
