import { Component, OnInit } from '@angular/core';

import { Topic } from '../topics/shared/topic.model';
import { TopicService } from '../topics/shared/topic.service';

import {TopicListComponent} from "../topics/shared/topic-list/topic-list.component";

@Component({
  selector: 'hip-dashboard',
  templateUrl: './app/dashboard/dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  langDashboard = 'Dashboard';
  langTopics = 'My topics';
  langLoading = 'Loading your Topics';
  topics: Topic[] = [];
  responseHandled = false;

  activity = [
    {
      'title': 'Your topic: "History in Paderborn" was commented', 'content': 'Dirk added a comment: "I really like that"'
    },
    {
      'title': 'New private message',
      'content': 'Bjorn wrote you a private message'
    },
    {
      'title': 'Your article was marked',
      'content': 'See the annotations your supervisor did'
    }
  ];

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
    this.topicService.getAllTopics()
      .then(
        (response: any) => this.handleResponseCreate(response)
      )
      .catch(
        (error: any) => this.handleError(error)
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
