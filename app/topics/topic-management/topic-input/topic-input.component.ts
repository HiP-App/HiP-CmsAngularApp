import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Topic } from '../../index';


@Component({
  selector: 'hip-topic-input',
  templateUrl: './app/topics/topic-management/topic-input/topic-input.component.html',
  styleUrls: ['./app/topics/topic-management/topic-input/topic-input.component.css']
})
export class TopicInputComponent implements OnInit {
  @Input() topic: Topic = Topic.emptyTopic();
  @Output() topicChange = new EventEmitter<Topic>();

  constructor() { }

  updateData() {
    this.topicChange.emit(this.topic);
  }

  ngOnInit() {
    if (this.topic.deadline !== null) {
      this.topic.deadline = this.topic.deadline.slice(0, 10);
    }
  }
}
