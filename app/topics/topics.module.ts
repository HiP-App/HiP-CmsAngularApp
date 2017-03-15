import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, MdUniqueSelectionDispatcher, OverlayModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TranslateModule } from 'ng2-translate';

import { topicRouting } from './topics.routing';
import { AddNewSubtopicComponent } from './topic-management/add-new-subtopic/add-new-subtopic.component';
import { AddExistingSubtopicComponent } from './topic-management/add-existing-subtopic/add-existing-subtopic.component';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { AttachmentService } from './topic-management/manage-attachments/attachment.service';
import { ContentComponent } from './content/content.component';
import { DeleteTopicComponent } from './topic-management/delete-topic/delete-topic.component';
import { DocumentService } from './topic-management/upload-document/document.service';
import { EditTopicComponent } from './topic-management/edit-topic/edit-topic.component';
import { ManageAttachmentsComponent } from './topic-management/manage-attachments/manage-attachments.component';
import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './topic-management/new-topic/new-topic.component';
import { ReviewersListComponent } from './topic-management/reviewer-topic-status/reviewer-status.component';
import { SharedModule } from '../shared/shared.module';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { TopicInputComponent } from './topic-management/topic-input/topic-input.component';
import { TopicListComponent } from './shared/topic-list/topic-list.component';
import { TopicService } from './shared/topic.service';
import { TopicTitleComponent } from './shared/topic-title.component';
import { TopicsFilterPipe } from './pipes/topic-filter.pipe';
import { TreeViewNodeComponent } from './shared/treeview-node/treeview-node.component';
import { UploadDocumentComponent } from './topic-management/upload-document/upload-document.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    Ng2PaginationModule,
    OverlayModule.forRoot(),
    SharedModule,
    ReactiveFormsModule,
    TranslateModule,
    topicRouting,
  ],
  declarations: [
    AddExistingSubtopicComponent,
    AddNewSubtopicComponent,
    AllTopicsComponent,
    ContentComponent,
    DeleteTopicComponent,
    EditTopicComponent,
    ManageAttachmentsComponent,
    MyTopicsComponent,
    NewTopicComponent,
    ReviewersListComponent,
    ShowTopicComponent,
    TopicInputComponent,
    TopicListComponent,
    TopicsFilterPipe,
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
    MdUniqueSelectionDispatcher,
    TopicService
  ]
})
export class TopicModule {}
