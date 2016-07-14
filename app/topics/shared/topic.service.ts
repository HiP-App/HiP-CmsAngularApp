import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';

import { Topic } from './topic.model';
import { CmsApiService } from '../../shared/api/cms-api.service';

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

  constructor(private cmsApiService: CmsApiService) { }

  public createTopic(topic: Topic) {
    let data = JSON.stringify(topic);
    console.log(data);
    return this.cmsApiService.putUrl('/topics', data, {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public deleteTopic(topic: Topic) {
    return this.cmsApiService.deleteUrl('/topics/' + topic.id, {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public deleteTopic(id: number) {
    return this.cmsApiService.deleteUrl('/topics/' + id, {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public getTopic(id: number) {
    return this.cmsApiService.getUrl('/topics/' + id, {})
      .toPromise()
      .then(this.extractData)
      .then(this.handleError);
  }

  public findTopic(query: string) {
    return this.cmsApiService.getUrl('/topics/' + query, {})
      .toPromise()
      .then(this.extractData)
      .then(this.handleError);
  }

  public updateTopic(topic: Topic) {
    let data = JSON.stringify(topic);
    return this.cmsApiService.postUrl('/topics/' + topic.id, data, {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


}
