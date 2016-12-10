import { Component, Input } from '@angular/core';
import { Topic } from '../../shared/topic.model';

@Component({
  moduleId: module.id,
  selector: 'hip-topic-list',
  templateUrl: 'topic-list.component.html',
  styleUrls: ['topic-list.component.css']
})
export class TopicListComponent {
  @Input() topics: Topic[];
}