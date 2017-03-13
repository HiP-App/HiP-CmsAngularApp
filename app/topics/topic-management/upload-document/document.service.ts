import { Injectable } from '@angular/core';

import { OOApiService } from '../../../core/api/oo-api.service';

/**
 * This service implements API calls related to attachments.
 */
@Injectable()
export class DocumentService {

  constructor(private OOService: OOApiService) {}

  public uploadDocument(topicId: number, fileToUpload: any) {
    let fd = new FormData();
    fd.append('uploadedFile', fileToUpload);

    return this.OOService.postUrlWithFormData('/topic/' + topicId, fd)
      .toPromise()
      .then(
        (response: any) => {
          return response;
        }
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
