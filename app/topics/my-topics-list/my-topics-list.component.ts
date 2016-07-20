import { Component, OnInit } from '@angular/core';
import { MdCard } from '@angular2-material/card';
import { MdList, MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';

import { ShowTopicComponent } from '../show-topic/show-topic.component';
import { TopicTitleComponent } from '../shared/topic-title.component';
import { Topic } from '../shared/topic.model';
import { TopicService } from '../shared/topic.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { CmsApiService } from '../../shared/api/cms-api.service';
import { TopicParserService } from '../../shared/parser/topic-parser.service';
import { UserService } from '../../shared/user/user.service';


@Component({
  selector: 'hip-my-topics',
  templateUrl: './app/topics/my-topics-list/my-topics-list.component.html',
  styleUrls: ['./app/topics/my-topics-list/my-topics-list.component.css'],
  directives: [MdCard, MdIcon, MdList, MD_LIST_DIRECTIVES, ShowTopicComponent, TopicTitleComponent,],
  viewProviders: [MdIconRegistry],
  providers: [TopicService, CmsApiService, TopicParserService, UserService]
})
export class MyTopicsComponent implements OnInit {
  langYourTopics = 'Your topics';
  content = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod ' +
    'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ' +
    'accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus ' +
    'est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed ' +
    'diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
    'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ' +
    'sanctus est Lorem ipsum dolor sit amet.\n' +
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod ' +
    'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ' +
    'accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus ' +
    'est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed ' +
    'diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
    'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ' +
    'sanctus est Lorem ipsum dolor sit amet.';

  topic1 = Topic.emptyTopic();
  topic2 = Topic.emptyTopic();
  topics = [this.topic1, this.topic2];

  constructor(private topicService: TopicService, private toasterService: ToasterService) {
    this.topic1.title = 'Title 1';
    this.topic2.title = 'Title 2';
    this.topic1.content = this.content;
    this.topic2.content = this.content;
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
    // this.toasterService.pop('success', 'Success', 'all topics loaded');
  }

  private handleError(error: string) {
     // this.toasterService.pop('error', 'Error while fetching your topics', error);
  }
}
