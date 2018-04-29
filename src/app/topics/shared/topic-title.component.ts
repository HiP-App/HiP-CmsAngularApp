import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'hip-topic-title',
  templateUrl: 'topic-title.component.html',
  styleUrls: ['topic-title.component.css']
})
export class TopicTitleComponent {
  @Input() title = 'No Title';
}
