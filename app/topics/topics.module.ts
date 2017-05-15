import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';

import { AddNewSubtopicComponent } from './topic-management/add-new-subtopic/add-new-subtopic.component';
import { AddExistingSubtopicComponent } from './topic-management/add-existing-subtopic/add-existing-subtopic.component';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { AttachmentInputComponent } from './topic-management/manage-attachments/attachment-input/attachment-input.component';
import { AttachmentService } from './topic-management/manage-attachments/attachment.service';
import { ContentComponent } from './content/content.component';
import { DeleteTopicComponent } from './topic-management/delete-topic/delete-topic.component';
import { DocumentService } from './topic-management/upload-document/document.service';
import { EditTopicComponent } from './topic-management/edit-topic/edit-topic.component';
import { ManageAttachmentsComponent } from './topic-management/manage-attachments/manage-attachments.component';
import { ManageReviewsComponent } from './topic-management/manage-reviews/manage-reviews.component';
import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './topic-management/new-topic/new-topic.component';
import { SharedModule } from '../shared/shared.module';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { TopicInputComponent } from './topic-management/topic-input/topic-input.component';
import { TopicListComponent } from './shared/topic-list/topic-list.component';
import { topicRouting } from './topics.routing';
import { TopicService } from './shared/topic.service';
import { TopicTitleComponent } from './shared/topic-title.component';
import { TreeViewNodeComponent } from './shared/treeview-node/treeview-node.component';
import { UploadDocumentComponent } from './topic-management/upload-document/upload-document.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    NgxPaginationModule,
    SharedModule,
    topicRouting,
  ],
  declarations: [
    AddExistingSubtopicComponent,
    AddNewSubtopicComponent,
    AllTopicsComponent,
    AttachmentInputComponent,
    ContentComponent,
    DeleteTopicComponent,
    EditTopicComponent,
    ManageAttachmentsComponent,
    ManageReviewsComponent,
    MyTopicsComponent,
    NewTopicComponent,
    ShowTopicComponent,
    TopicInputComponent,
    TopicListComponent,
    TopicTitleComponent,
    TreeViewNodeComponent,
    UploadDocumentComponent
  ],
  exports: [
    TopicListComponent
  ],
  providers: [
    AttachmentService,
    DocumentService,
    TopicService
  ]
})
export class TopicModule {}
