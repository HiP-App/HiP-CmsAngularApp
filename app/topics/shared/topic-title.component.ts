import { Component, Input } from '@angular/core';

@Component({
  selector: 'hip-topic-title',
  templateUrl: 'topic-title.component.html',
  styleUrls: ['topic-title.component.css']
})
export class TopicTitleComponent {
  @Input() title: string = 'No Title';
}
