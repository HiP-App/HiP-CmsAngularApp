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

  public createAttachment(attachment: Attachment, fileToUpload: any) {
    let fd = new FormData();
    fd.append("AttatchmentName", attachment.name);
    fd.append("Description", attachment.description);
		fd.append('file', fileToUpload);
    return this.cmsApiService._postUrl('/Api/Topics/' + attachment.topicId + '/Attachments', fd)
      .toPromise()
      .then(
        (response: any) => {
          console.log(response);
          return response;
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  public deleteAttachment(id: number, topicId: number) {
    return this.cmsApiService.deleteUrl('/Api/Topics/' + topicId + '/Attachments/' + id, {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  public getAttachment(id: number, topicId: number) {
    return this.cmsApiService._getUrl('/Api/Topics/' + topicId + '/Attachments/' + id)
      .toPromise()
      .then(
        (response: any) => {
          let hash = response._body;
          hash = hash.substr(1, hash.length-2);
          return this.cmsApiService.getRoot() + '/Api/Download/' + hash;
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  public getAllAttachmentsOfTopic(topicId: number) {
    return this.cmsApiService.getUrl('/api/Topics/' + topicId + '/Attachments', {})
      .toPromise()
      .then(
        (response: any) => Attachment.extractArrayData(response, topicId)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(error);
    return Promise.reject(errMsg);
  }
}
