import { Component, Input } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { DocumentService } from './document.service';

@Component({
  moduleId: module.id,
  selector: 'hip-upload-document',
  templateUrl: 'upload-document.component.html'
})
export class UploadDocumentComponent {
  @Input() topicId: number;
  private documentSelected = false;
  private uploading = false;
  translatedResponse: any;

  constructor(private documentService: DocumentService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  private uploadDocument(files: Array<Blob>) {
    if (files && files[0]) {
      let fileToUpload = files[0];
      this.uploading = true;
      this.documentService.uploadDocument(this.topicId, fileToUpload)
        .then(
          () => {
            this.uploading = false;
          }
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Could not save attachment') , error);
          }
        );
    } else {
      this.toasterService.pop('error', this.getTranslatedString('please select a file'));
    }
  }

  private fileInputChanged(files: Array<Blob>) {
    this.documentSelected = !!(files && files[0]);
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}
