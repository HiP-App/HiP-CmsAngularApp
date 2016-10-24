import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {Topic} from '../../index';
import {TopicService} from "../../shared/topic.service";


@Component({
  selector: 'hip-topic-input',
  templateUrl: './app/topics/topic-management/topic-input/topic-input.component.html',
  styleUrls: ['./app/topics/topic-management/topic-input/topic-input.component.css']
})
export class TopicInputComponent implements OnInit {
  @Input() topic: Topic = Topic.emptyTopic();
  @Output() topicChange = new EventEmitter<Topic>();
  queriedTopics: Topic[] = [];

  constructor(private topicService: TopicService) {
  }

  getQueryTopic() {
    this.queriedTopics = [];
    if (this.topic.title.length >= 3) {
      this.topicService.findTopic(this.topic.title).then(
        (data: any) => this.getAddedTopics(<Topic[]>data))
    }
  }

  getTopicId(id: any) {
    window.open(location.origin + "/topics/" + id);
  }

  getAddedTopics(topiclist: Topic[]) {
    for (let topics of topiclist) {
      this.queriedTopics.push(topics);
    }
  }

  updateData() {
    this.topicChange.emit(this.topic);
  }

  ngOnInit() {
    if (this.topic.deadline !== null) {
      this.topic.deadline = this.topic.deadline.slice(0, 10);
    }
  }
}



