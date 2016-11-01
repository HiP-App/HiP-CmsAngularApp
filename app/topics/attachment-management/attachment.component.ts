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
  styleUrls: ['./app/topics/attachment-management/attachment.component.css']
})
export class AttachmentComponent implements OnInit {
  private title: string;
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
        (response: any) => {
          this.topic = <Topic> response;
          this.title = this.topic.title;
          this.topicResponseHandled = true;
        }
      )
      .catch(
        (error: any) => {
          this.topicResponseHandled = true;
          this.toasterService.pop('error', 'Error', 'Could not get the topic data!');
        }
      );

    // Get the attachment data.
    this.attachmentService.getAllAttachmentsOfTopic(topicId)
      .then(
        (response: any) => {
          this.attachments = response;

          // TODO: remove test data
          let a1 = Attachment.emptyAttachment(131);
          a1.id = 25;
          a1.name = 'Test';
          a1.description = 'Test Desc';
          a1.contentType = 'audio';
          a1.contentDisposition = 'all';
          a1.fileName = 'test.mp3';
          a1.headers = 'test Headers';
          a1.length = 4500;
          this.attachments.push( a1 );

          let a2 = Attachment.emptyAttachment(131);
          a2.id = 42;
          a2.name = 'Test 2';
          a2.description = 'This is a very long description to test whether the layout fits for long texts.';
          a2.contentType = 'video';
          a2.contentDisposition = 'only for me';
          a2.fileName = 'testvideo.mp4';
          a2.headers = 'What is this field for?';
          a2.length = 50;
          this.attachments.push(a2);

          this.attachmentsResponseHandled = true;
        }
      )
      .catch(
        (error: any) => {
          this.attachmentsResponseHandled = true;
          this.toasterService.pop('error', 'Error', 'Could not get the list of attachments!');
        }
      );
  }

  private createAttachment() {
    console.log("att topic:" + this.newAttachment.topicId);
    console.log("att name:" + this.newAttachment.name);
    console.log("att desc:" + this.newAttachment.description);

    this.attachmentService.createAttachment(this.newAttachment)
      .then(
        (response: any) => {
          console.log(response);
          this.toasterService.pop('success', 'Success', 'Attachment was saved!');
          this.newAttachment = Attachment.emptyAttachment(this.topic.id);
        }
      )
      .catch(
        (error: any) => {
          console.log(error);
          this.toasterService.pop('error', 'Error', 'Could not save attachment!');
        }
      );
  }

  private deleteAttachment(id: number, topicId: number) {
    console.log('delete att ' + id + " of " + topicId);
    this.attachmentService.deleteAttachment(id, topicId)
      .then(
        (response: any) => {
          console.log(response);
          this.toasterService.pop('success', 'Success', 'Attachment was deleted!');
          this.attachments = this.attachments.filter(item => item.id != id);
        }
      )
      .catch(
        (error: any) => {
          console.log(error);
          this.toasterService.pop('error', 'Error', 'Attachment could not be deleted!');
        }
      );
  }
}
