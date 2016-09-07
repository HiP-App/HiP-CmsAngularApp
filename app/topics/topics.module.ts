import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './new-topic/new-topic.component';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { TopicTitleComponent } from './shared/topic-title.component';
import { TopicService } from './shared/topic.service';
import { topicRouting } from './topics.routing';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { TextareaComponent } from '../shared/textarea/textarea.component';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { TreeView } from './shared/treeview-node/treeview-node.component';

@NgModule({
  imports: [
    BrowserModule,
    topicRouting,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    AllTopicsComponent,
    MyTopicsComponent,
    NewTopicComponent,
    ShowTopicComponent,
    TopicTitleComponent,
    TextareaComponent,
    TreeView
  ],
  providers: [
    TopicService
  ]
})
export class TopicModule {}
