import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { Achievement } from './achievement.model';
import { AchievementApiService } from '../../shared/achievement-api.service';

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
                localAchievements.sort(Achievement.achievementAlphaCompare);
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
        let searchParams = '';
        searchParams += '?Page=' + page +
            '&PageSize=' + pageSize +
            '&OrderBy=' + orderBy +
            '&Status=' + status +
            '&Type=' + type +
            '&Query=' + encodeURIComponent(query) +
            includeOnly.reduce((prev, curr) => prev + '&IncludeOnly=' + curr, '');

        return this.achievementApiService.getUrl('/api/Achievements' + searchParams, {})
            .toPromise()
            .then(
            (response: Response) => {
                return {
                    items: Achievement.extractPaginatedArrayData(response),
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
            (response: Response) => Achievement.extractAchievement(response)
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

    private static handleError(error: any) {
        let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Promise.reject(errMsg);
    }
}
