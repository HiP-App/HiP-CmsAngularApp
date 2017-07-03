import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { MobileContentApiService } from '../../shared/mobile-content-api.service';
import { SearchArguments } from '../../shared/search-arguments.model';
import { Tag } from './tag.model';

@Injectable()
export class TagService {

  constructor(private mobileContentApiService: MobileContentApiService) {}

  /**
   * Retrieves a subset of all tags based on supplied filter parameters.
   * Returns an object with two keys:
   * `items` an array of Tag objects that satisfy supplied search parameters and
   * `metadata` an object containing info on the returned subset (page number, total results, etc.)
   * @param page Page number for pagination.
   * @param pageSize Amount of users per page.
   * @param query Additional query to look for in topic title and description.
   * @param status Only return tags with specified status.
   * @param orderBy the field to order the results by
   * @param includeArray the ids of the tags to include in the response
   */
  public getAllTags(page: number, pageSize: number, status = '', query = '', orderBy = 'id', includeArray?: string): Promise<any> {
    let searchParams = '';
    searchParams += '?Page=' + page +
      '&PageSize=' + pageSize +
      '&OrderBy=' + orderBy +
      '&Status=' + status +
      (includeArray ? includeArray : '&query=' + query);
    return this.mobileContentApiService.getUrl('/api/Tags' + searchParams, {})
      .toPromise()
      .then(
        (response: Response) => {
          return {
            items: Tag.extractPaginatedArrayData(response),
            total: response.json().total
          };
        }
      ).catch(
        (error: any) => TagService.handleError(error)
      );
  }

  /**
   * Gets a Tag by Id.
   * @param id The Id of the Tag you want to get
   * @returns {Promise<Tag>} a Promise for a Tag object
   */
  public getTag(id: number) {
    return this.mobileContentApiService.getUrl('/api/Tags/' + id, {})
      .toPromise()
      .then(
        (response: Response) => Tag.extractData(response)
      ).catch(
        (error: any) => TagService.handleError(error)
      );
  }

  /**
   * Creates a Tag on the backend
   * @param tag The tag you want to save
   * @returns {Promise<Tag>} a Promise for a Tag object
   */
  public createTag(tag: Tag) {
    let tagJson = JSON.stringify({
      title: tag.title,
      description: tag.description,
      status: tag.status
    });
    return this.mobileContentApiService.postUrl('/api/Tags', tagJson, {})
      .toPromise()
      .then(
        (response: Response) => {
          return response.json();
        }
      ).catch(
        (error: any) => TagService.handleError(error)
      );
  }

  /**
   * Updates a given Tag
   * @param tag The tag you want to update
   * @returns {Promise<Tag>} a Promise for a tag object
   */
  public updateTag(tag: Tag) {
    let tagJson = JSON.stringify({
      title: tag.title,
      description: tag.description,
      image: tag.image,
      status: tag.status
    });
    return this.mobileContentApiService.putUrl('/api/Tags/' + tag.id, tagJson, {})
      .toPromise()
      .catch(
        (error: any) => TagService.handleError(error)
      );
  }

  /**
   * deletes a Tag, identified by an id
   * @param id Id of the tag you want to be deleted
   * @returns {Promise<Response>} a Promise for the server response
   */
  public deleteTag(id: number) {
    return this.mobileContentApiService.deleteUrl('/api/Tags/id?id=' + id, {})
      .toPromise()
      .catch(
        (error: any) => TagService.handleError(error)
      );
  }

  private static handleError(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }
}
