import { Component, OnInit } from '@angular/core';

import { ShowTopicComponent } from '../show-topic/show-topic.component';
import { TopicTitleComponent } from '../shared/topic-title.component';
import { Topic } from '../shared/topic.model';
import { TopicService } from '../shared/topic.service';
import { CmsApiService } from '../../shared/api/cms-api.service';
import { UserService } from '../../shared/user/user.service';


@Component({
  selector: 'hip-my-topics',
  templateUrl: './app/topics/my-topics-list/my-topics-list.component.html',
  styleUrls: ['./app/topics/my-topics-list/my-topics-list.component.css'],
  directives: [ShowTopicComponent, TopicTitleComponent],
  providers: [TopicService, CmsApiService, UserService]
})
export class MyTopicsComponent implements OnInit {
  langYourTopics = 'Your topics';
  langTopics = 'You do not have any topic yet';
  langLoading = 'Loading your Topics';
  topics: Topic[] = [];
  responseHandled = false;

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
    this.topicService.getAllTopics()
      .then(
        response => this.handleResponseCreate(response)
      )
      .catch(
        error => this.handleError(error)
      );
  }

  private handleResponseCreate(response: Topic[]) {
    this.topics = response;
    this.responseHandled = true;
  }

  private handleError(error: string) {
    this.langTopics = 'Not able to fetch your topics';
    this.responseHandled = true;
  }
}
