import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './topic-management/new-topic/new-topic.component';
import { TopicTitleComponent } from './shared/topic-title.component';
import { TopicService } from './shared/topic.service';
import { topicRouting } from './topics.routing';
import { MaterialModule } from '../material/material.module';
import { TextareaComponent } from '../shared/textarea/textarea.component';
import { TopicInputComponent } from './topic-management/topic-input/topic-input.component';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { TranslateModule } from 'ng2-translate';
import { TopicListComponent } from './shared/topic-list/topic-list.component';
import { EditTopicComponent } from './topic-management/edit-topic/edit-topic.component';

@NgModule({
  imports: [
    BrowserModule,
    topicRouting,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [
    MyTopicsComponent,
    NewTopicComponent,
    TopicInputComponent,
    TopicTitleComponent,
    TextareaComponent,
    ShowTopicComponent,
    TopicListComponent,
    EditTopicComponent
  ],
  providers: [
    TopicService,
  ]
})
export class TopicModule {}
