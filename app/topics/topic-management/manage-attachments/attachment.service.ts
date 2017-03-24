import { Injectable } from '@angular/core';

import { Attachment } from './attachment.model';
import { CmsApiService } from '../../../core/api/cms-api.service';

/**
 * This service implements API calls related to attachments.
 */
@Injectable()
export class AttachmentService {

  constructor(private cmsApiService: CmsApiService) {}

  public createAttachment(attachment: Attachment, fileToUpload: any) {
    let fd = new FormData();
    fd.append('file', fileToUpload);

    let data = {
      title: attachment.metadata.title
    };
    return this.cmsApiService.postUrl('/Api/Topics/' + attachment.topicId + '/Attachments', JSON.stringify(data), {})
      .toPromise()
      .then(
        (response: any) => {
          attachment.id = response.json().value;
          this.addFile(attachment.id, attachment.topicId, fd);
          this.createAttachmentMetadata(attachment);
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  private addFile(attachmentId: number, topicId: number, fd: FormData) {
    return this.cmsApiService.putUrlWithFormData('/Api/Topics/' + topicId + '/Attachments/' + attachmentId, fd)
      .toPromise()
      .then(
        (res: any) => {
          return res;
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  private createAttachmentMetadata(attachment: Attachment) {
    let url = '/Api/Topics/' + attachment.topicId + '/Attachments/' + attachment.id + '/Metadata';
    return this.cmsApiService.postUrl(url, JSON.stringify(attachment.metadata), {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  public updateAttachmentMetadata(attachment: Attachment) {
    let url = '/Api/Topics/' + attachment.topicId + '/Attachments/' + attachment.id + '/Metadata';
    return this.cmsApiService.putUrl(url, JSON.stringify(attachment.metadata), {})
      .toPromise()
      .then(
        (response: any) => response
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
    return this.cmsApiService.getUrl('/Api/Topics/' + topicId + '/Attachments/' + id, {})
      .toPromise()
      .then(
        (response: any) => {
          let hash = response.json().value;
          return this.cmsApiService.getRoot() + '/Download/' + hash;
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
    console.error(error);
    return Promise.reject(errMsg);
  }
}
