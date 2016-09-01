import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './new-topic/new-topic.component';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { TopicTitleComponent } from './shared/topic-title.component';
import { TopicService } from './shared/topic.service';
import { topicRouting } from './topics.routing';
import { BrowserModule } from '@angular/platform-browser';
import { MdRippleModule, MdCoreModule } from '@angular2-material/core';
import { MdSidenavModule } from '@angular2-material/sidenav';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdListModule } from '@angular2-material/list';
import { MdRadioModule } from '@angular2-material/radio';
import { MdInputModule } from '@angular2-material/input';
import { MdIconModule } from '@angular2-material/icon';
import { MdCardModule } from '@angular2-material/card';
import { MdButtonModule } from '@angular2-material/button';

@NgModule({
  imports: [
    BrowserModule,
    topicRouting,
    FormsModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdCardModule,
    MdIconModule,
    MdInputModule,
    MdRadioModule,
    MdListModule,
    MdCoreModule,
    MdToolbarModule,
    MdSidenavModule,
    MdRippleModule,
  ],
  declarations: [
    MyTopicsComponent,
    NewTopicComponent,
    ShowTopicComponent,
    TopicTitleComponent
  ],
  providers: [
    TopicService
  ]
})
export class TopicModule {}
