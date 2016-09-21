import { Component, OnInit } from '@angular/core';


import { TopicService } from '../shared/topic.service';
import { Topic } from '../shared/topic.model'
import { ToasterService } from 'angular2-toaster';


@Component({
  selector: 'hip-all-topics',
  templateUrl: './app/topics/all-topics/all-topics.component.html'
})

export class AllTopicsComponent implements OnInit {

  topics: Array<Topic> = [];

  constructor(private topicService: TopicService, private toasterService: ToasterService) {}

  ngOnInit() {
    this.topicService.getAllParentTopics()
      .then(
        response => this.topics = response
      )
      .catch(
        error => this.toasterService.pop('error', 'Error fetching Topics', error.message)
      );
  }
}

