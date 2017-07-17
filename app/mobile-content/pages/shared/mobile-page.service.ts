import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { MobilePage } from './mobile-page.model';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';

@Injectable()
export class MobilePageService {

  constructor(private mobileApiService: MobileContentApiService) {}

  /**
   * Saves a new exhibit page on the server.
   * The `exhibitId` property of the new page must be set before calling this method,
   * as it dictates to which exhibit does the new page belong.
   * @param page an `ExhibitPage` object to be saved remotely
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
   * Retrieves the `id`s of all exhibit pages currently stored on the server.
   * @param status Restricts results to only pages of a specific status. Defaults to 'ALL'.
   */
  getAllIds(status = 'ALL'): Promise<number[]> {
    return this.mobileApiService.getUrl(`/api/Exhibits/Pages/ids?status=${status}`)
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError(error)
      );
  }

  /**
   * Retrieves `id`s of all exhibit pages that belong to a specific exhibit.
   * @param id id of the exhibit for which to retrieve the exhibit page ids
   * @param status Restricts results to only pages of a specific status. Defaults to 'ALL'.
   */
  getAllIdsFor(id: number, status = 'ALL'): Promise<number[]> {
    return this.mobileApiService.getUrl(`/api/Exhibits/${id}/Pages/ids?status=${status}`)
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError(error)
      );
  }

  /**
   * Retrieves all exhibit pages currently stored on the server.
   * @param status Restricts results to only pages of a specific status. Defaults to 'ALL'.
   */
  getAllPages(query = '', status = 'ALL'): Promise<MobilePage[]> {
    let params = '?status=' + status;
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
   * Retrieves all exhibit pages for a specific exhibit.
   * @param id id of the exhibit for which to fetch exhibit pages
   * @param status Restricts results to only pages of a specific status. Defaults to 'ALL'.
   */
  getAllPagesFor(id: number, status = 'ALL'): Promise<MobilePage[]> {
    return this.mobileApiService.getUrl(`/api/Exhibits/${id}/Pages?status=${status}`)
      .toPromise()
      .then(
        response => MobilePage.parseObjectArray(response.json().items)
      ).catch(
        error => this.handleError(error)
      );
  }

  /**
   * Retrieves a specific exhibit page.
   * @param id id of the desired exhibit page
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
   * Deletes a specific exhibit page on the server.
   * @param id id of the exhibit page to delete
   */
  deletePage(id: number): Promise<Response> {
    return this.mobileApiService.deleteUrl(`/api/Exhibits/Pages/${id}`)
      .toPromise()
      .catch(
        error => this.handleError(error)
      );
  }

  /**
   * Updates an exhibit page on the server.
   * @param page an exhibit page to update
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
