import { Injectable } from '@angular/core';
import { RequestOptions, ResponseContentType, Headers, Response } from '@angular/http';

import { SearchArguments } from '../../shared/search-arguments.model';
import { Medium } from './medium.model';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';

@Injectable()
export class MediaService {

  constructor(private mobileContentApiService: MobileContentApiService) { }

  /**
   * With this function the User is able to get all available media`s
   * @param page the page number
   * @param pageSize the number of media on one page
   * @param orderBy the field to order the results by
   * @param query the query to search for
   * @param status the status of the media to return
   * @param type the type of the media to return
   * @returns {Promise<AllEntities<Medium>>} returns a AllEntities object that contains all available media`s
   */
  public getAllMedia(page = 1, pageSize = 10, orderBy = '', query = '', status = '', type = ''): Promise<any> {
    let searchParams = new SearchArguments(page, pageSize, orderBy, query, status).toString();
    if (type !== 'ALL') {
      searchParams += 'type=' + type;
    }
    return this.mobileContentApiService.getUrl('/api/Media/' + searchParams, {})
      .toPromise()
      .then(
      (response: Response) => {
        let media: Medium[] = [];
        let data = response.json();
        if (data.total > 0) {
          data.items.forEach((medium: Medium) => media.push(medium as Medium));
        }
        return {
          items: media,
          total: data.total
        };
      }
      ).catch(
      (error: any) => MediaService.handleError(error)
      );
  }

  /**
   * With this function the User is able to get media by id
   * @param id identification number of the media
   * @param date (optional) datetime information. Return Media if media was changed after date
   * @returns returns the medium
   */
  public getMediaById(id: number, date?: Date) {
    return this.mobileContentApiService.getUrl('/api/Media/' + id, {})
      .toPromise()
      .then(
      (res: Response) => {
        return res.json();
      }
      ).catch(
      (error: any) => MediaService.handleError(error)
      );
  }

  /**
   * Create new Media object on  the server
   * @param media Media that has to be saved on  the server
   * @returns returns Create
   */
  public postMedia(media: Medium) {
    let mediaJson = JSON.stringify({
      title: media.title,
      description: media.description,
      status: media.status,
      type: media.type
    });
    return this.mobileContentApiService.postUrl('/api/Media', mediaJson, {})
      .toPromise()
      .then(
      (res: Response) => {
        return res.json();
      }
      ).catch(
      (error: any) => MediaService.handleError(error)
      );
  }

  /**
   * Update existing media on the server
   * @param media media that contains id of desired media and new information that will be updated
   * @returns returns Update
   */
  public updateMedia(media: Medium) {
    let mediaJson = JSON.stringify({
      title: media.title,
      description: media.description,
      status: media.status,
      type: media.type
    });
    return this.mobileContentApiService.putUrl('/api/Media/' + media.id, mediaJson)
      .toPromise()
      .then(
      (res: Response) => {
        return res.json();
      }
      ).catch(
      (error: any) => MediaService.handleError(error)
      );
  }

  /**
   * Delete media on the server
   * @param id Id of media that has to be deleted
   * @returns return Delete
   */
  public deleteMedia(id: number) {
    return this.mobileContentApiService.deleteUrl('/api/Media/' + id, {})
      .toPromise()
      .then(
      (res: Response) => {
        return res;
      }
      ).catch(
      (error: any) => MediaService.handleError(error)
      );
  }

  /**
   * Upload File for existing media
   * @param id Identification number of existing media
   * @param file File object that has to be saved
   * @returns returns Update
   */
  public uploadFile(id: number, file: File) {
    if (file) {
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      return this.mobileContentApiService.putUrlWithFormData('/api/Media/' + id + '/File', formData)
        .toPromise()
        .then(
        (res: Response) => {
          return res;
        }
        ).catch(
        (error: any) => MediaService.handleError(error)
        );
    }
  }

  /**
   * Download media file from the server
   * @param id identifier of the medium
   * @param viewImage as boolean for not downloading
   * @returns {Promise<void>} returns Void
   */
  public downloadFile(id: number, viewImage: boolean) {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.ArrayBuffer });
    return this.mobileContentApiService.getUrl('/api/Media/' + id + '/File', options)
      .toPromise()
      .then(
      response => {
      MediaService.extractContent(response, viewImage);
      }
      ).catch(
      error => MediaService.handleError(error)
      );
  }

  /**
   * Extract the File from Response context and download it
   * @param res Response
   */
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

  /**
   * Gets the history of changes
   * @param id Id of the Media you want to be deleted
   * @returns {Promise<Response>} a Promise for the server response
   */
  getHistory(id: number): Promise<Response> {
    return this.mobileContentApiService.getUrl('/api/Media/' + id + '/History' , {})
      .toPromise()
      .then(
        (response: Response) => {
          return response.json();
        }
      ).catch(
        (error: any) => MediaService.handleError(error)
      );
  }

  private static handleError(error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }
}
