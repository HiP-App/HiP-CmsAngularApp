import { Injectable } from '@angular/core';
import { RequestOptions , ResponseContentType, Headers , Response } from '@angular/http';

import { AllEntities } from '../../shared/shared.model';
import { Medium } from './medium.model';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';

@Injectable()
export class MediaService {

    constructor(private mobileContentApiService: MobileContentApiService) {
    }

    /**
     * With this function the User is able to get all available media`s
     * @param args of the type SearchMediaArguments contains information about filtering the media`s
     * @returns {Promise<AllEntities<Medium>>} returns a AllEntities object that contains all available media`s
     */
    getAllMedia(page = 1, pageSize = 10, orderBy = '', query = '', status = '', type = ''): Promise<AllEntities<Medium>> {

        let searchParams = '';
        searchParams += '?&page=' + page +
          '&pageSize=' + pageSize +
          '&orderBy=' + orderBy +
          '&query=' + query +
          '&status=' + status +
          '&type=' + type;
        return this.mobileContentApiService.getUrl('/api/Media/' + searchParams, {})
          .toPromise()
          .then(
            (response: Response) => {
                let mediums = new Array<Medium>();
                let data = response.json();
                if (data.total === 0) {
                    return mediums;
                }
                data.items.forEach((media: Medium) => mediums.push(media as Medium));
                return new AllEntities<Medium>(data.total, mediums);
            }).catch((error: any) => this.handleError(error));
    }

    /**
     * With this function the User is able to get media by id
     * @param id identification number of the media
     * @param date (optional) datetime information. Return Media if media was changed after date
     * @returns returns Media
     */
    getMediaById(id: number, date?: Date) {

        return this.mobileContentApiService.getUrl('/api/Media/' + id, {})
          .toPromise()
          .then(
            (res: Response) => {
                return res.json();
            }).catch((error: any) => this.handleError(error));
    }

    /**
     * Create new Media object on  the server
     * @param media Media that has to be saved on  the server
     * @returns returns Create
     */
    postMedia(media: Medium) {
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
            }).catch((error: any) => this.handleError(error));
    }

    /**
     * Update existing media on the server
     * @param media media that contains id of desired media and new information that will be updated
     * @returns returns Update
     */
    updateMedia(media: Medium) {
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
            }).catch((error: any) => this.handleError(error));
    }

    /**
     * Delete media on the server
     * @param id Id of media that has to be deleted
     * @returns return Delete
     */
    deleteMedia(id: number) {
        return this.mobileContentApiService.deleteUrl('/api/Media/' + id, {})
          .toPromise()
          .then(
            (res: Response) => {
                return res;
            }).catch((error: any) => this.handleError(error));
    }

    /**
     * Upload File for existing media
     * @param id Identification number of existing media
     * @param file File object that has to be saved
     * @returns returns Update
     */
    uploadFile(id: number, file: File) {
        if (file) {
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            return this.mobileContentApiService.putUrlWithFormData('/api/Media/' + id + '/File', formData)
              .toPromise()
              .then(
                (res: Response) => {
                    return res;
                }).catch((error: any) => this.handleError(error));
        }
    }


    /**
     * Download media file from the server
     * @param id Identification number of the media
     * @returns {Promise<void>} returns Void
     */
    downloadFile(id: number): Promise<void> {

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({headers: headers, responseType: ResponseContentType.ArrayBuffer});
        return this.mobileContentApiService.getUrl('/api/Media/' + id + '/File', options)
          .toPromise()
          .then(this.extractContent)
          .catch((error: any) => this.handleError(error));
    }

    /**
     * Extract the File from Response context and download it
     * @param res Response
     */
    private extractContent(res: Response) {

        let blob: Blob = res.blob();
        let mainHead = res.headers.get('content-disposition');
        let filename = mainHead.split(';')
          .map(x => x.trim())
          .map(s => {
              if (s.split('=')[0] === 'filename') {
                  return s.split('=')[1];
              }
          })
          .filter(x => x)[0];
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = typeof(filename) === 'string' ? filename : 'download';
        a.target = '_blank';
        a.click();
        a.remove();
    }


    private checkId(id: number) {
        return typeof(id) !== 'number';
    }


    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(error);
        return Promise.reject(errMsg);
    }

}
