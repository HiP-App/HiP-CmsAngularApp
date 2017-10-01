import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { Exhibit } from './exhibit.model';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';

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
        (error: any) => ExhibitService.handleError(error)
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
        (error: any) => ExhibitService.handleError(error)
      );
  }

  /**
   * Retrieves a subset of all exhibits based on supplied filter parameters.
   * Returns an object with two keys:
   * `items` an array of Topic objects that satisfy supplied search parameters and
   * `metadata` an object containing info on the returned subset (page number, total results, etc.)
   * @param page Page number for pagination.
   * @param pageSize Amount of users per page.
   * @param query Additional query to look for in topic title and description.
   * @param orderBy query to bring ordered array according to a particular column.
   * @param status Only return exhibits with specified status.
   * @param includeOnly array of exhibit ids to retrieve
   * @param onlyInRoutes array of route ids that an exhibit has to be part of
   */
  getAllExhibits(page: number, pageSize: number, status = 'ALL', query = '', orderBy = 'id',
                 includeOnly: number[] = [], onlyInRoutes: number[] = []) {
    let searchParams = '';
    searchParams += '?Page=' + page +
      '&PageSize=' + pageSize +
      '&OrderBy=' + orderBy +
      '&Status=' + status +
      '&Query=' + encodeURIComponent(query) +
      includeOnly.reduce((prev, curr) => prev + '&IncludeOnly=' + curr, '') +
      onlyInRoutes.reduce((prev, curr) => prev + '&OnlyRoutes=' + curr, '');

    return this.mobileContentApiService.getUrl('/api/Exhibits' + searchParams, {})
      .toPromise()
      .then(
        (response: Response) => {
          return {
            items: Exhibit.extractPaginatedArrayData(response),
            total: response.json().total
          };
        }
      ).catch(
        (error: any) => ExhibitService.handleError(error)
      );
  }

  getTagNames(ids: any): Promise<any> {
    let searchParams = '';
    searchParams += ids;
    return this.mobileContentApiService.getUrl('/api/Tags' + searchParams, {})
      .toPromise()
      .then(
        (response: Response) => {
          let returnValue = response.json();
          return {
            items: returnValue.items
          };
        }
      ).catch(
        (error: any) => ExhibitService.handleError(error)
      );
  }

  getExhibit(id: number): Promise<Exhibit> {
    return this.mobileContentApiService.getUrl('/api/Exhibits/' + id, {})
      .toPromise()
      .then(
        (response: Response) => Exhibit.extractExhibit(response)
      ).catch(
        (error: any) => ExhibitService.handleError(error)
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
        (error: any) => ExhibitService.handleError(error)
      );
  }

  getExhibitRating(id: number) {
    return this.mobileContentApiService.getUrl('/api/Exhibits/Rating/' + id, {})
      .toPromise()
      .then(
        (response: Response) => response.json()
      ).catch(
        (error: any) => ExhibitService.handleError(error)
      );
  }

  createExhibitRating(id: number, rating: number) {
    return this.mobileContentApiService.postUrl('/api/Exhibits/Rating/' + id + '?Rating=' + rating, {})
      .toPromise()
      .then(
        (response: Response) => response
      ).catch(
        (error: any) => ExhibitService.handleError(error)
      );
  }

  private static handleError(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }
}
