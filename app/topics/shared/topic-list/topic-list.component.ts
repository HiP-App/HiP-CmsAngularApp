import { Component, Input } from '@angular/core';
import { Topic } from '../../shared/topic.model';

@Component({
  selector: 'hip-topic-list',
  templateUrl: './app/topics/shared/topic-list/topic-list.component.html',
  styleUrls: ['./app/topics/shared/topic-list/topic-list.component.css']
})
export class TopicListComponent {
  @Input() topics: Topic[];
}