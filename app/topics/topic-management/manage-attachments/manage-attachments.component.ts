import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Attachment } from './attachment.model';
import { AttachmentService } from './attachment.service';
import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';

@Component({
  moduleId: module.id,
  selector: 'hip-manage-attachments',
  templateUrl: 'manage-attachments.component.html',
  styleUrls: ['manage-attachments.component.css']
})
export class ManageAttachmentsComponent implements OnInit {
  private title: string;
  private topic: Topic;
  private topicResponseHandled: boolean = false;
  private attachments: Attachment[] = [];
  private attachmentsResponseHandled: boolean = false;
  private newAttachment: Attachment;
  private newAttachmentFileSelected: boolean = false;
  private uploading: boolean = false;
  translatedResponse: any;

  constructor(private attachmentService: AttachmentService,
              private topicService: TopicService,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[1].path === 'manage-attachments') {
      let topicId = +this.route.snapshot.params['id'];
      this.getData(topicId);
      this.newAttachment = Attachment.emptyAttachment(topicId);
    }
  }

  private getData(topicId: number) {
    // Get the topic data.
    this.topicService.getTopic(topicId)
      .then(
        (response: any) => {
          this.topic = <Topic> response;
          this.title = this.topic.title;
          this.topicResponseHandled = true;
        }
      ).catch(
        (error: any) => {
          this.topicResponseHandled = true;
          this.toasterService.pop('error', this.getTranslatedString('Could not get the topic data') , error);
        }
      );

    // Get the attachment data.
    this.loadAttachments(topicId);
  }

  private loadAttachments(topicId: number) {
    this.attachmentService.getAllAttachmentsOfTopic(topicId)
      .then(
        (response: any) => {
          this.attachments = response;
          this.attachmentsResponseHandled = true;
        }
      ).catch(
        (error: any) => {
          this.attachmentsResponseHandled = true;
          this.toasterService.pop('error', this.getTranslatedString('Could not get the list of attachments') , error);
        }
      );
  }

  private createAttachment(files: Array<Blob>) {
    if (files && files[0]) {
      let fileToUpload = files[0];
      this.uploading = true;
      this.attachmentService.createAttachment(this.newAttachment, fileToUpload)
        .then(
          (response: any) => {
            // Reload attachment list and reset the attachment for the new attachment
            this.loadAttachments(this.topic.id);
            this.newAttachment = Attachment.emptyAttachment(this.topic.id);
            this.newAttachmentFileSelected = false;
            this.uploading = false;
          }
        ).catch(
          (error: any) => {
            console.log(error);
            this.toasterService.pop('error', this.getTranslatedString('Could not save attachment') , error);
          }
        );
    } else {
      this.toasterService.pop('error', this.getTranslatedString('please select a file'));
    }
  }

  private fileInputChanged(files: Array<Blob>) {
    if (files && files[0]) {
      this.newAttachmentFileSelected = true;
    } else {
      this.newAttachmentFileSelected = false;
    }
  }

  private deleteAttachment(id: number, topicId: number) {
    this.attachmentService.deleteAttachment(id, topicId)
      .then(
        (response: any) => {
          this.attachments = this.attachments.filter(item => item.id != id);
        }
      ).catch(
      (error: any) => {
        console.log(error);
        this.toasterService.pop('error', this.getTranslatedString('Attachment could not be deleted') , error);
      }
    );
  }

  private downloadFile(id: number, topicId: number) {
    this.attachmentService.getAttachment(id, topicId)
      .then(
        (response: any) => {
          let link = document.createElement('a');
          link.href = response;
          document.body.appendChild(link);
          link.click();
        }
      ).catch(
        (error: any) => {
          console.log(error);
          this.toasterService.pop('error', this.getTranslatedString('Attachment could not be downloaded') , error);
        }
    );
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    )
    return this.translatedResponse;
  }
}
