import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { MobileContentApiService } from '../../shared/mobile-content-api.service';
import { Tag } from './tag.model';

@Injectable()
export class TagService {

  constructor(private mobileContentApiService: MobileContentApiService) {}

  /**
   * Shorthand method to find tags, with a query
   * @param query
   * @param page
   * @returns {Promise<Tag>} a Promise for a Tag object
   */
  public findTag(query: string, page = 1) {
    return this.getAllTags(page, 10, 'ALL', query, 'id').then(data => data.items);
  }

  /**
   * Shorthand method to find tags, with a query
   * @param query
   * @param page
   * @returns {Promise<Tag>} a Promise for a Tag object
   */
  public findTagWithStatus(status: string, page = 1) {
    return this.getAllTags(page, 10, 'status', '', 'id').then(data => data.items);
  }

  /**
   * Retrieves a subset of all tags based on supplied filter parameters.
   * Returns an object with two keys:
   * `items` an array of Tag objects that satisfy supplied search parameters and
   * `metadata` an object containing info on the returned subset (page number, total results, etc.)
   * @param page Page number for pagination.
   * @param pageSize Amount of users per page.
   * @param query Additional query to look for in topic title and description.
   * @param status Only return tags with specified status.
   */
  public getAllTags(page: number, pageSize: number, status = '', query = '', orderBy = 'id') {
    let searchParams = '';
    searchParams += '?page=' + page +
      '&pageSize=' + pageSize +
      '&query=' + query +
      '&status=' + status +
      '&OrderBy=' + orderBy;

    return this.mobileContentApiService.getUrl('/api/Tags' + searchParams, {})
      .toPromise()
      .then(
        response => {
          return {
            items: Tag.extractPaginatedArrayData(response),
            total: response.json().total
          };
        }
      ).catch(
        (error: any) => this.handleError(error)
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
        (response: any) => Tag.extractData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  // POST

  /**
   * Creates a Tag on the backend
   * @param tag The tag you want to save
   * @returns {Promise<Tag>} a Promise for a Tag object
   */
  public createTag(tag: Tag) {
    let tagJson = JSON.stringify({title: tag.title, description: tag.description, status: tag.status});
    return this.mobileContentApiService.postUrl('/api/Tags', tagJson, {})
      .toPromise()
      .then(
        (response: any) => {
          return response.json();
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  // PUT

  /**
   * Updates a given Tag
   * @param tag The tag you want to update
   * @returns {Promise<Tag>} a Promise for a tag object
   */
  public updateTag(tag: Tag) {
    let tagJson = JSON.stringify({title: tag.title, description: tag.description, image: tag.image, status: tag.status});
    return this.mobileContentApiService.putUrl('/api/Tags/' + tag.id, tagJson, {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }


  // DELETE

  /**
   * deletes a Tag, identified by an id
   * @param id Id of the tag you want to be deleted
   * @returns {Promise<Response>} a Promise for the server response
   */
  public deleteTag(id: number) {
    return this.mobileContentApiService.deleteUrl('/api/Tags/id?id=' + id, {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }


  private handleError(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }
}
