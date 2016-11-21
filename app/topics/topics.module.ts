import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';

import { TranslateModule } from 'ng2-translate';
import { TagInputModule } from 'ng2-tag-input';
import { Ng2PaginationModule } from 'ng2-pagination';

import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './topic-management/new-topic/new-topic.component';
import { TopicTitleComponent } from './shared/topic-title.component';
import { TopicService } from './shared/topic.service';
import { topicRouting } from './topics.routing';
import { TextareaComponent } from '../shared/textarea/textarea.component';
import { TopicInputComponent } from './topic-management/topic-input/topic-input.component';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { TopicListComponent } from './shared/topic-list/topic-list.component';
import { EditTopicComponent } from './topic-management/edit-topic/edit-topic.component';
import { DeleteTopicComponent } from './topic-management/delete-topic/delete-topic.component';
import { NewSubtopicComponent } from './topic-management/add-subtopic/add-subtopic.component';

import { TagInputComponent } from '../shared/taginput/taginput.component';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { TreeView } from './shared/treeview-node/treeview-node.component';
import { TopicsFilterPipe } from '../topics/pipes/topic-filter.pipe';

import { ManageAttachmentsComponent } from './topic-management/manage-attachments/manage-attachments.component';
import { AttachmentService } from './topic-management/manage-attachments/attachment.service'

@NgModule({
  imports: [
    BrowserModule,
    topicRouting,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    TagInputModule,
    Ng2PaginationModule,
  ],
  declarations: [
    AllTopicsComponent,
    MyTopicsComponent,
    NewTopicComponent,
    TopicInputComponent,
    TopicTitleComponent,
    TextareaComponent,
    ShowTopicComponent,
    TopicListComponent,
    EditTopicComponent,
    DeleteTopicComponent,
    TreeView,
    TagInputComponent,
    TopicsFilterPipe,
    ManageAttachmentsComponent,
    NewSubtopicComponent,
  ],
  exports: [
    TopicListComponent
  ],
  providers: [
    TopicService,
    AttachmentService,
    MdUniqueSelectionDispatcher
  ]
})
export class TopicModule {
}
