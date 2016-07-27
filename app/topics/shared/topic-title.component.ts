import { Component, Input } from '@angular/core';
import { MdCard } from '@angular2-material/card';

@Component({
  selector: 'hip-topic-title',
  templateUrl: './app/topics/shared/topic-title.component.html',
  styleUrls: ['./app/topics/shared/topic-title.component.css'],
  directives: [MdCard]
})
export class TopicTitleComponent {
  @Input() title: string = 'No Title';
}
