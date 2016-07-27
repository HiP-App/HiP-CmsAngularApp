import { Component } from '@angular/core';

import { ShowTopicComponent } from '../show-topic/show-topic.component';
import { TopicTitleComponent } from '../shared/topic-title.component';

@Component({
  selector: 'hip-new-topic',
  templateUrl: './app/topics/new-topic/new-topic.component.html',
  directives: [TopicTitleComponent, ShowTopicComponent]
})
export class NewTopicComponent {
}
