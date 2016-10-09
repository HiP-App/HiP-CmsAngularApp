import { Injectable } from '@angular/core';
import { CmsApiService } from '../core/api/cms-api.service';
import { Response, Http } from '@angular/http';
import { User } from '../core/user/user.model';


@Injectable()
export class UploadFileService
{

	constructor(private cmsApiService:CmsApiService, private http: Http){

	}

	uploadFile(file:any){
		let input = new FormData();
    input.append("file", file);

    return this.http.post('/api/uploadFile', input);
	}

}

