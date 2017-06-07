import { Injectable } from '@angular/core';
import { RequestOptions , ResponseContentType, Headers , Response } from '@angular/http';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';
import { Medium } from './medium.model';
import { Status } from '../../shared/status.model';
import { SearchMediaArgs } from '../../shared/REST/searchArgs.model';
import { ServerError, ErrorMessage } from '../../shared/REST/serverError.model';
import  * as Result  from '../../shared/REST/serverResults.model';


@Injectable()
export class MediaService {



    constructor(private mobileContentApiService: MobileContentApiService) {}

    readAllIds(status?: string): Promise <Result.AllIds> {

        if( status && !Status.getValuesForSearch().includes(status))
            throw new Error(`Status : ${status} is invalid`);

        let url = `/api/Media/ids?`;
        url += status ? `status=${status}` : '';

        return this.mobileContentApiService.getUrl(url)
            .toPromise()
            .then((response: Response) => {
                let idsArray = response.json() as number[];
                return new Result.AllIds(idsArray);
            })
            .catch(this.handleError);

    }

    readAll(args: SearchMediaArgs): Promise<Result.AllEntities<Medium>> {

        let url = `/api/Media/?${args.toGetString()}`;

        return this.mobileContentApiService.getUrl(url)
            .toPromise()
            .then((response: Response) => {

                let mediums = new Array<Medium>();
                let data = response.json();

                if (data.total === 0)
                    return mediums;

                data.items.forEach((media: any) => mediums.push(media as Medium));
                return new Result.AllEntities<Medium>(Number(data.total), mediums);
            })
            .catch(this.handleError);
    }

    readById(id: number, date?: Date): Promise<Result.Entity<Medium>> {

        if(this.checkId(id))
            return this.wrongIdError();

        let url = `/api/Media/${id}`;
        url += date ? `?timestamp=${date.toISOString()}` : '';

        return this.mobileContentApiService.getUrl(url)
            .toPromise()
            .then((res: Response) => {
                return new Result.Entity(<Medium> res.json());
            })
            .catch(this.handleError);

    }

    create(media: Medium): Promise<Result.Create> {

        let url = `/api/Media`;
        let ignoreKeys = ['id', 'timestamp', 'used'];
        for (let value of ignoreKeys){
            delete media[value];
        }
        return this.mobileContentApiService.postUrl(url, media)
            .toPromise()
            .then((res: Response) => {
                return new Result.Create(Number(res.text()));
            })
            .catch(this.handleError);


    }

    update(media: Medium): Promise<Result.Update> {

        let url = `/api/Media/${media.id}`;
        let ignoreKeys = ['id', 'timestamp', 'used'];
        for (let value of ignoreKeys){
            delete media[value];
        }

        return this.mobileContentApiService.putUrl(url, media)
            .toPromise()
            .then((res: Response) => {
                return new Result.Update();
            })
            .catch(this.handleError);
    }

    delete(id: number): Promise<Result.Delete> {

        if(this.checkId(id))
            return this.wrongIdError();

        let url = `/api/Media/${id}`;
        return this.mobileContentApiService.deleteUrl(url)
            .toPromise()
            .then((res: Response) => {
                return new Result.Delete();
            })
            .catch(this.handleError);

    }

    uploadFile(id: number, file: File): Promise< Result.Update > {

        if(this.checkId(id))
            return this.wrongIdError();

        if (file) {
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            let url = `/api/Media/${id}/File`;

            return this.mobileContentApiService.putUrlWithFormData(url, formData)
                .toPromise()
                .then((res: Response) => {
                    return new Result.Update();
                })
                .catch(this.handleError);
        }
    }



    downloadFile(id: number): Promise<void> {

        if(this.checkId(id))
            return this.wrongIdError();

        let url = `/api/Media/${id}/File`;
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers : headers, responseType: ResponseContentType.ArrayBuffer });

        return this.mobileContentApiService.getUrl(url, options)
            .toPromise()
            .then(this.extractContent)
            .catch(this.handleError);
    }

    private extractContent(res: Response ) {

        let blob: Blob = res.blob();
        let mainHead = res.headers.get('content-disposition');

        let filename = mainHead.split(';')
            .map(x => x.trim())
            .map(s => { if (s.split('=')[0] === 'filename')return s.split('=')[1]; })
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
        return new Promise((res) => {res(); }).then(() => { throw new ServerError(0, ErrorMessage.getErrorMessages({'error': 'Id is undefinded' })); });
    }

    private handleError(e: Response) {
        throw new ServerError(Number(e.status), ErrorMessage.getErrorMessages(e.text() !== '' ? e.json() : { text: e.statusText }));
    }




}