import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { Topic } from '../../index';
import { TopicService } from '../../shared/topic.service';


@Component({
  selector: 'hip-topic-input',
  templateUrl: './app/topics/topic-management/topic-input/topic-input.component.html',
  styleUrls: ['./app/topics/topic-management/topic-input/topic-input.component.css']
})
export class TopicInputComponent implements OnInit, OnChanges {
  @Input() topic: Topic = Topic.emptyTopic();
  @Output() topicChange: EventEmitter<Topic>;
  @Output() fieldChange: EventEmitter<string>;
  queriedTopics: Topic[] = [];

  constructor(private topicService: TopicService) {
    this.topicChange = new EventEmitter<Topic>();
    this.fieldChange = new EventEmitter<string>();
  }

  ngOnInit() {
    if (this.topic.deadline !== null) {
      this.topic.deadline = this.topic.deadline.slice(0, 10);
    }
  }

  getQueryTopic() {
    this.queriedTopics = [];
    if (this.topic.title.length >= 3) {
      this.topicService.findTopic(this.topic.title).then(
        (data: any) => this.getAddedTopics(<Topic[]>data));
    }
  }

  openTopicInNewWindow(id: number) {
    window.open(location.origin + '/topics/' + id);
  }

  modelChanged(detail: any) {
    console.log('input.modelChanged ' + detail);
    this.fieldChange.emit(detail);
  }

  getAddedTopics(topiclist: Topic[]) {
    for (let topics of topiclist) {
      this.queriedTopics.push(topics);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    console.log(this.topic);
    this.topicChange.emit(this.topic);
  }

}



