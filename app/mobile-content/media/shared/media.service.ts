import { Injectable } from '@angular/core';
import { RequestOptions , ResponseContentType, Headers , Response } from '@angular/http';

import { Medium } from './medium.model';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';
import { SearchMediaArguments } from '../../shared/REST/search-arguments.model';
import { ServerError, ErrorMessage } from '../../shared/REST/server-errors.model';
import { Status } from '../../shared/status.model';
import  * as Result  from '../../shared/REST/server-results.model';


@Injectable()
export class MediaService {

    constructor(private mobileContentApiService: MobileContentApiService) {}

    /**
     * With this function the User is able to get all available media id`s
     * @param status of the Medias (e.g DRAFT, IN_REVIEW, ...)
     * @returns {Promise<AllIds>} returns a AllIds object that contains all available ids
     */
    readAllIds(status?: string): Promise <Result.AllIds> {

        if ( status && !Status.getValuesForSearch().includes(status)) {
            throw new Error(`Status : ${status} is invalid`);
        }
        let url = `/api/Media/ids?`;
        url += status ? `status=${status}` : '';
        return this.mobileContentApiService.getUrl(url)
            .toPromise()
            .then(
               (response: Response) => {
               let idsArray = response.json() as number[];
               return new Result.AllIds(idsArray);
            }).catch(this.handleError);
    }

    /**
     * With this function the User is able to get all available media`s
     * @param args of the type SearchMediaArguments contains information about filtering the media`s
     * @returns {Promise<AllEntities<Medium>>} returns a AllEntities object that contains all available media`s
     */
    readAll(args: SearchMediaArguments): Promise<Result.AllEntities<Medium>> {

        let url = `/api/Media/?${args}`;
        return this.mobileContentApiService.getUrl(url)
            .toPromise()
            .then(
               (response: Response) => {
               let mediums = new Array<Medium>();
               let data = response.json();
               if (data.total === 0) {
                    return mediums;
               }
               data.items.forEach((media: Medium) => mediums.push(media as Medium));
               return new Result.AllEntities<Medium>(Number(data.total), mediums);
            }).catch(this.handleError);
    }

    /**
     * With this function the User is able to get media by id
     * @param id identification number of the media
     * @param date (optional) datetime information. Return Media if media was changed after date
     * @returns {Promise<Entity<Medium>>} returns Media
     */
    readById(id: number, date?: Date): Promise<Result.Entity<Medium>> {

        if (this.checkId(id)) {
            return this.wrongIdError();
        }
        let url = `/api/Media/${id}`;
        url += date ? `?timestamp=${date.toISOString()}` : '';
        return this.mobileContentApiService.getUrl(url)
            .toPromise()
            .then(
               (res: Response) => {
               return new Result.Entity(<Medium> res.json());
            }).catch(this.handleError);
    }

    /**
     * Create new Media object on  the server
     * @param media Media that has to be saved on  the server
     * @returns {Promise<Create>} returns Create
     */
    create(media: Medium): Promise<Result.Create> {

        let url = `/api/Media`;
        let ignoreKeys = ['id', 'timestamp', 'used'];
        for (let value of ignoreKeys){
            delete media[value];
        }
        return this.mobileContentApiService.postUrl(url, media)
            .toPromise()
            .then(
               (res: Response) => {
               return new Result.Create(Number(res.text()));
            }).catch(this.handleError);
    }

    /**
     * Update existing media on the server
     * @param media media that contains id of desired media and new information that will be updated
     * @returns {Promise<Update>} returns Update
     */
    update(media: Medium): Promise<Result.Update> {

        let url = `/api/Media/${media.id}`;
        let ignoreKeys = ['id', 'timestamp', 'used'];
        for (let value of ignoreKeys){
            delete media[value];
        }
        return this.mobileContentApiService.putUrl(url, media)
            .toPromise()
            .then(
               (res: Response) => {
               return new Result.Update();
            }).catch(this.handleError);
    }

    /**
     * Delete media on the server
     * @param id Id of media that has to be deleted
     * @returns {Promise<Delete>} return Delete
     */
    delete(id: number): Promise<Result.Delete> {

        if (this.checkId(id)) {
            return this.wrongIdError();
        }
        let url = `/api/Media/${id}`;
        return this.mobileContentApiService.deleteUrl(url)
            .toPromise()
            .then(
               (res: Response) => {
               return new Result.Delete();
            }).catch(this.handleError);
    }

    /**
     * Upload File for existing media
     * @param id Identification number of existing media
     * @param file File object that has to be saved
     * @returns {Promise<Update>} returns Update
     */
    uploadFile(id: number, file: File): Promise< Result.Update > {

        if (this.checkId(id)) {
            return this.wrongIdError();
        }
        let url = `/api/Media/${id}/File`;
        if (file) {
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            return this.mobileContentApiService.putUrlWithFormData(url, formData)
                .toPromise()
                .then(
                   (res: Response) => {
                   return new Result.Update();
                }).catch(this.handleError);
        }
    }


    /**
     * Download media file from the server
     * @param id Identification number of the media
     * @returns {Promise<void>} returns Void
     */
    downloadFile(id: number): Promise<void> {

        if (this.checkId(id)) {
            return this.wrongIdError();
        }
        let url = `/api/Media/${id}/File`;
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers : headers, responseType: ResponseContentType.ArrayBuffer });
        return this.mobileContentApiService.getUrl(url, options)
            .toPromise()
            .then(this.extractContent)
            .catch(this.handleError);
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
            .map(s => { if (s.split('=')[0] === 'filename') {return s.split('=')[1]; }})
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
    private wrongIdError() {
        return new Promise((res) => {res(); }).then(() => {
            throw new ServerError(0, ErrorMessage.getErrorMessages({'error': 'Id is undefined' }));
        });
    }

    private handleError(e: Response) {
        throw new ServerError(Number(e.status), ErrorMessage.getErrorMessages(e.text() !== '' ? e.json() : { text: e.statusText }));
    }

}
