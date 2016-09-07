import { Component, Input } from '@angular/core';

@Component({
  selector: 'hip-topic-title',
  templateUrl: './app/topics/shared/topic-title.component.html',
  styleUrls: ['./app/topics/shared/topic-title.component.css']
})
export class TopicTitleComponent {
  @Input() title: string = 'No Title';
}
