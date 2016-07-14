import {Injectable} from '@angular/core';
import {Headers, Response} from '@angular/http';
import {Router} from '@angular/router';

import {Topic} from './topic.model';
import {CmsApiService} from '../../shared/api/cms-api.service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class TopicService {
  private extractData(res: Response): Topic {
    let body = res.json();
    console.log(body);
    return body || {};
  }


  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

  constructor(private router: Router, private cmsApiService: CmsApiService) {
  }

  createTopic(topic: Topic) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('jwt'));

    let data = JSON.stringify(topic);
    console.log(data);
    this.cmsApiService.putUrl('/topics', data, headers)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
}
