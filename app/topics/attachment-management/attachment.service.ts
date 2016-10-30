import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Attachment } from './attachment.model';
import { CmsApiService } from '../../core/api/cms-api.service';

/**
 * This service implements API calls related to attachments.
 */
@Injectable()
export class AttachmentService {

  constructor(private cmsApiService: CmsApiService) {}

  public createAttachment(attachment: Attachment) {
    let data = attachment.getFormData();
    return this.cmsApiService.postUrl('/Api/Topics' + attachment.topicId + '/Attachments', data, {})
      .toPromise()
      .then((response: any) => {
        let body = response.json();
        return body;
      })
      .catch(this.handleError);
  }

  public deleteAttachment(id: number, topicId: number) {
    return this.cmsApiService.deleteUrl('/Api/Topics' + topicId + '/Attachments/' + id, {})
      .toPromise()
      .then(this.extractBooleanData)
      .catch(this.handleError);
  }

  public getAttachment(id: number, topicId: number) {
    return this.cmsApiService.getUrl('/Api/Topics/' + topicId + '/Attachments/' + id, {})
      .toPromise()
      .then((response: any) => Attachment.extractData(response))
      .catch(this.handleError);
  }

  public getAllAttachmentsOfTopic(topicId: number) {
    return this.cmsApiService.getUrl('/api/Topics/' + topicId + '/Attachments', {})
      .toPromise()
      .then((response: any) => Attachment.extractArrayData(response))
      .catch(this.handleError);
  }

  private extractBooleanData(res: Response): boolean {
    let body = res.text();
    console.log(body);
    if (body === 'true') {
      return true;
    } else {
      throw new Error(body);
    }
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(error);
    return Promise.reject(errMsg);
  }
}
