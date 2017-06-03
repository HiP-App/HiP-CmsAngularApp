import { Injectable } from '@angular/core';
import { RequestOptions , ResponseContentType, Headers , Response } from '@angular/http';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';
import { Medium } from '../medium.model';
import { Status } from '../../shared/status.model';
import { SearchArgs } from '../../shared/searchArgs.model';


@Injectable()
export class MediaService {

    constructor(private mobileContentApiService: MobileContentApiService) {}


    getAllMediaIds(status?: string): Promise<number[]> {

        if (status !== null && !Status.getValuesForSearch().includes(status))
            throw new Error(`Status : ${status} is invalid`);

        let url = `/api/Media/ids?`;
        url += status ? `status=${status}` : '';

        return this.mobileContentApiService.getUrl(url)
            .toPromise()
            .then((response: Response) => {
                let idsArray = response.json() as number[];
                return idsArray;
            });
    }

    getAllMedia(args: SearchArgs): Promise<Medium[]> {

        let url = `/api/Media/?${args.toGetString()}`;

        return this.mobileContentApiService.getUrl(url)
            .toPromise()
            .then((response: Response) => {
                let mediums = new Array<Medium>();
                let data = response.json();

                if (data.total === 0)
                    return mediums;

                data.items.forEach((media: any) => mediums.push(media as Medium));
                return {total: data.total, items: mediums};
            }).catch((error: any) => this.handleError(error));
    }

    getMediaById(id: number, date?: Date): Promise<any> {

        if (typeof(id) !== 'number')
            return Promise.reject('Id is undefined');


        let url = `/api/Media/${id}`;
        url += date ? `?timestamp = ${date.valueOf()}` : '';

        return this.mobileContentApiService.getUrl(url)
            .toPromise()
            .then((res: Response) => {
                return <Medium> res.json();
            });

    }

    createMedia(media: Medium): Promise<any> {
        let url = `/api/Media`;
        let mediaJson = JSON.stringify(media, function (key, value) {
            let ignoreKeys = ['id', 'timestamp'];
            return ignoreKeys.includes(key) ? undefined : value;
        });

        return this.mobileContentApiService.postUrl(url, mediaJson)
            .toPromise()
            .then((res: Response) => {
                let id = Number(res.text());
                return id;
            });


    }

    updateMedia(media: Medium): Promise<any> {

        if (typeof(media.id) !== 'number')
            return Promise.reject('Id is undefinded');

        let url = `/api/Media/${media.id}`;
        let mediaJson = JSON.stringify(media, function (key, value) {
            let ignoreKeys = ['id', 'timestamp'];
            return ignoreKeys.includes(key) ? undefined : value;
        });

        return this.mobileContentApiService.putUrl(url, mediaJson)
            .toPromise();
    }

    deleteMedia(id: number): Promise<any> {
        if (typeof(id) !== 'number')
            return Promise.reject('Id is undefinded');

        let url = `/api/Media/${id}`;
        return this.mobileContentApiService.deleteUrl(url)
            .toPromise();
    }


    /*Upload Media File to the server via API call
     * @param id Id of the media you want to upload file to
     * @returns {Promise<Response>} a Promise for the server response
     *!/
     */
    uploadFile(id: number, file: File) {
        if ( file && typeof(id) === `number` ) {
            let url = `/api/Media/${id}/File`;
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            let headers = new Headers();
            headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers : headers});

           return this.mobileContentApiService.putUrl(url, formData, options)
                                        .toPromise()
                                        .catch((error: any) => this.handleError(error));
        }
    }

    /* Get Media File from the server via API call
     * @param id Id of the media you want to download file to
     * @returns {Promise<File>} a Promise for the server responses
     */
    getFile(id: number): Promise<File> {

        let url = `/api/Media/${id}/File`;
        let options = new RequestOptions({headers: new Headers(), responseType: ResponseContentType.Blob});

        return this.mobileContentApiService.getUrl(url, options)
            .toPromise()
            .then((response: Response) => {
                return this.extractFile(response);
            })
            .catch((error: any) => this.handleError(error));

    }

    private extractFile(res: Response ): File {

        let blob: Blob = res.blob();
        let headers: Headers = res.headers;
        let fileName = this.getFileNameFromHeaderOrDefault(headers);

        return new File([blob], fileName);
    }

    private getFileNameFromHeaderOrDefault(headers: Headers ): string {

        let defaultFileName = 'download';
        let mainHead = headers.get('content-disposition');
        if (!mainHead)
            return defaultFileName;

        let filename = mainHead.split(';')
            .map(s => {
                let array = s.trim().split('=');
                if (array[0] === 'filename')
                    return array[1]; })
            .filter(x => x)[0];
        return typeof(filename) === 'string' ? filename : defaultFileName;
    }


    private handleError(error: any) {
        let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Promise.reject(errMsg);
    }




}