import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { MobilePage, pageTypeForSearch } from './mobile-page.model';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';
import { statusTypeForSearch } from '../../shared/status.model';

@Injectable()
export class MobilePageService {

  constructor(private mobileApiService: MobileContentApiService) {}

  /**
   * Saves a new mobile page on the server.
   * @param page a `MobilePage` object to be saved remotely
   * @returns the `id` of the new page if it was saved on the server successfully
   */
  createPage(page: MobilePage): Promise<number> {
    return this.mobileApiService.postUrl('/api/Exhibits/Pages', JSON.stringify(page))
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError(error)
      );
  }

  /**
   * Retrieves id's of all mobile pages currently stored on the server.
   * @param status Restricts results to only pages with a specific status. Defaults to 'ALL'.
   */
  getAllIds(status: statusTypeForSearch = 'ALL'): Promise<number[]> {
    return this.mobileApiService.getUrl(`/api/Exhibits/Pages/ids?status=${status}`)
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError(error)
      );
  }

  /**
   * Retrieves id's of all mobile pages that belong to a specific exhibit.
   * @param id id of the exhibit for which to retrieve page id's
   * @param status Restricts results to only pages with a specific status. Defaults to 'ALL'.
   */
  getAllIdsFor(id: number, status: statusTypeForSearch = 'ALL'): Promise<number[]> {
    return this.mobileApiService.getUrl(`/api/Exhibits/${id}/Pages/ids?status=${status}`)
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError(error)
      );
  }

  /**
   * Retrieves all mobile pages currently stored on the server.
   * @param status Restricts results to only pages with a specific status. Defaults to 'ALL'.
   */
  getAllPages(query = '', status: statusTypeForSearch = 'ALL', type: pageTypeForSearch = 'ALL'): Promise<MobilePage[]> {
    let params = '?status=' + status;
    params += type === 'ALL' ? '' : '&type=' + type;
    if (query) {
      params += '&query=' + encodeURIComponent(query);
    }
    return this.mobileApiService.getUrl('/api/Exhibits/Pages' + params)
      .toPromise()
      .then(
        response => MobilePage.parseObjectArray(response.json().items)
      ).catch(
        error => this.handleError(error)
      );
  }

  /**
   * Retrieves all mobile pages for a specific exhibit.
   * @param id id of the exhibit for which to fetch pages
   * @param status Restricts results to only pages with a specific status. Defaults to 'ALL'.
   */
  getAllPagesFor(id: number, status: statusTypeForSearch = 'ALL', type: pageTypeForSearch = 'ALL'): Promise<MobilePage[]> {
    let params = '?status=' + status;
    params += type === 'ALL' ? '' : '&type=' + type;
    return this.mobileApiService.getUrl(`/api/Exhibits/${id}/Pages` + params)
      .toPromise()
      .then(
        response => MobilePage.parseObjectArray(response.json().items)
      ).catch(
        error => this.handleError(error)
      );
  }

  /**
   * Retrieves a specific mobile page.
   * @param id id of the desired page
   */
  getPage(id: number): Promise<MobilePage> {
    return this.mobileApiService.getUrl(`/api/Exhibits/Pages/${id}`)
      .toPromise()
      .then(
        response => MobilePage.parseObject(response.json())
      ).catch(
        error => this.handleError(error)
      );
  }

  /**
   * Deletes a specific mobile page on the server.
   * @param id id of the page to delete
   */
  deletePage(id: number): Promise<Response> {
    return this.mobileApiService.deleteUrl(`/api/Exhibits/Pages/${id}`)
      .toPromise()
      .catch(
        error => this.handleError(error)
      );
  }

  /**
   * Updates a mobile page on the server. Essentially overwrites all properties of a page whose `id` property
   * matches the id of the supplied `MobilePage` object.
   * @param page page to update as `MobilePage` object
   */
  updatePage(page: MobilePage): Promise<Response> {
    return this.mobileApiService.putUrl(`/api/Exhibits/Pages/${page.id}`, JSON.stringify(page))
      .toPromise()
      .catch(
        error => this.handleError(error)
      );
  }

  private handleError(error: Response) {
    let message = error.status + ' ' + error.statusText;
    return Promise.reject(message);
  }
}
