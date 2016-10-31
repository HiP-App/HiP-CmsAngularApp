import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { Attachment } from './attachment.model';
import { AttachmentService } from './attachment.service';
import { Topic } from '../shared/topic.model';
import { TopicService } from '../shared/topic.service';

@Component({
  selector: 'hip-topic-attachment',
  templateUrl: './app/topics/attachment-management/attachment.component.html',
  /*styleUrls: ['./app/topics/attachment-management/attachment.component.css']*/
})
export class AttachmentComponent implements OnInit {
  private topic: Topic;
  private topicResponseHandled: boolean = false;
  private attachments: Attachment[] = [];
  private attachmentsResponseHandled: boolean = false;
  private newAttachment: Attachment;

  constructor(private attachmentService: AttachmentService,
              private topicService: TopicService,
              private route: ActivatedRoute,
              private toasterService: ToasterService) {
  }

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
        (response: any) => this.handleTopicResponse(response)
      )
      .catch(
        (error: any) => this.handleTopicError(error)
      );

    // Get the attachment data.
    this.attachmentService.getAllAttachmentsOfTopic(topicId)
      .then(
        (response: any) => this.handleAttachmentsResponse(response)
      )
      .catch(
        (error: any) => this.handleAttachmentsError(error)
      );
  }

  private handleTopicResponse(response: any) {
    this.topic = <Topic> response;
    this.topicResponseHandled = true;
  }

  private handleTopicError(error: string) {
    console.log('error topic');
    this.topicResponseHandled = true;
  }

  private handleAttachmentsResponse(response: any) {
    this.attachments = response;
    this.attachmentsResponseHandled = true;
  }

  private handleAttachmentsError(error: string) {
    this.attachmentsResponseHandled = true;
  }

  private createAttachment() {
    console.log("att topic:" + this.newAttachment.topicId);
    console.log("att name:" + this.newAttachment.name);
    console.log("att desc:" + this.newAttachment.description);

    this.attachmentService.createAttachment(this.newAttachment)
      .then(
        (response: any) => this.handleCreateAttachmentResponse(response)
      )
      .catch(
        (error: any) => this.handleCreateAttachmentError(error)
      );
  }

  private handleCreateAttachmentResponse(response: any) {
    console.log(response);
    this.toasterService.pop('success', 'Success', 'Attachment was saved!');
  }

  private handleCreateAttachmentError(error: string) {
    console.log(error);
    this.toasterService.pop('error', 'Error', 'Could not save attachment!');
  }
}