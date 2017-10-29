import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { Achievement } from './achievement.model';
import { AchievementApiService } from '../../shared/achievement-api.service';
import { ExhibitsVisitedAchievement } from './exhibits-visited-achievement.model';
import { RouteFinishedAchievement } from './route-finished-achievement.model';

@Injectable()
export class AchievementService {
    private achievementCache: BehaviorSubject<Achievement[]> = new BehaviorSubject([]);

    constructor(private achievementApiService: AchievementApiService) { }

    createAchievement(achievement: Achievement): Promise<number> {
        return this.achievementApiService.postUrl('/api/Achievements', JSON.stringify(achievement), {})
            .toPromise()
            .then(
            (response: Response) => {
                let newId = response.json().value as number;
                let localAchievements = this.achievementCache.getValue();

                achievement.id = newId;
                localAchievements.push(achievement);
                localAchievements.sort(AchievementService.achievementAlphaCompare);
                this.achievementCache.next(localAchievements);

                return newId;
            })
            .catch(
            (error: any) => AchievementService.handleError(error)
            );
    }

    // ExhibitVisited Achievement service

    createExhibitVisitedAchievement(exhibitsVisitedAchievement: ExhibitsVisitedAchievement): Promise<number> {
        return this.achievementApiService.postUrl('/api/Achievements/ExhibitsVisited', JSON.stringify(exhibitsVisitedAchievement), {})
            .toPromise()
            .then(
            (response: Response) => {
                let newId = response.json().value as number;
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

     // RouteFinished Achievement service

     createRouteFinishedAchievement(routeFinishedAchievement: RouteFinishedAchievement): Promise<number> {
        return this.achievementApiService.postUrl('/api/Achievements/ExhibitsVisited', JSON.stringify(RouteFinishedAchievement), {})
            .toPromise()
            .then(
            (response: Response) => {
                let newId = response.json().value as number;
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
                console.log("type" , response);
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

    updateAchievement(achievement: Achievement): Promise<Response> {
        return this.achievementApiService.putUrl('/api/Achievements/' + achievement.id, JSON.stringify(achievement), {})
            .toPromise()
            .then(
            (response: Response) => {
                let localAchievements = this.achievementCache.getValue();
                let achievementToUpdate = localAchievements.find(item => item.id === achievement.id);

                for (let prop in achievementToUpdate) {
                    if (achievementToUpdate.hasOwnProperty(prop)) {
                        achievementToUpdate[prop] = achievement[prop];
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
                    obj.imageUrl,
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
                    obj.imageUrl,
                    obj.timestamp
                );
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
