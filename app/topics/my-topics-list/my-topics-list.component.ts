import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../shared/topic.model';
import { TopicService } from '../shared/topic.service';

@Component({
  moduleId: module.id,
  selector: 'hip-my-topics',
  templateUrl: 'my-topics-list.component.html',
  styleUrls: ['my-topics-list.component.css']
})
export class MyTopicsComponent implements OnInit {
  query = '';
  showingSearchResults = false;
  topics: Topic[];
  private translatedResponse: string;

  constructor(private topicService: TopicService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.getTopics();
  }

  findTopics() {
    if (this.query.trim().length > 0) {
      this.showingSearchResults = true;
      this.getTopics(this.query.trim());
    }
  }

  getTopics(query?: string) {
    this.topics = undefined;
    this.topicService.getAllTopicsOfCurrentUser(query)
      .then(
        data => this.topics = data
      )
      .catch(
        error => this.toasterService.pop('error', this.translate('Not able to fetch your topics'), error)
      );
  }

  resetSearch() {
    this.query = '';
    this.showingSearchResults = false;
    this.getTopics();
  }

  private translate(data: string): string {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }
}
