import { Component, OnInit } from '@angular/core';

import { CmsApiService } from '../../core/api/cms-api.service';
import { TopicService } from '../shared/topic.service';
import { Topic } from '../shared/topic.model';

@Component({
  moduleId: module.id,
  selector: 'hip-all-topics',
  templateUrl: 'all-topics.component.html',
  styles: [`ul { padding-left: 0; }`]
})
export class AllTopicsComponent implements OnInit {
  query = '';
  topics: Topic[];
  allTopics: Topic[];

  totalTopics: number;
  topicsPerPage = 10;
  currentPage = 1;

  private topicCache = new Map<number, Topic[]>();

  constructor(private topicService: TopicService,
              private cmsApiService: CmsApiService) {}

  ngOnInit() {
    this.getPage(1);
  }

  searchTopics() {
    if (this.query.length >= 1) {
      this.topicService.findTopic(this.query, this.currentPage)
        .then(
          response => {
            this.allTopics = response;
          }
        ).catch(
          (error: any) => {
            console.error('Error in searching topics' + error);
          }
        );
    }
  }

  getPage(page: number) {
    if (this.topicCache.has(page)) {
      this.topics = this.topicCache.get(page);
      this.currentPage = page;
    } else {
      let requestUrl = '/api/Topics?';
      requestUrl += 'page=' + page;
      requestUrl += '&pageSize=' + this.topicsPerPage;
      requestUrl += '&onlyParents=' + true;

      this.cmsApiService.getUrl(requestUrl, {})
        .map(
          response => response.json()
        ).subscribe(
          data => {
            this.topics = data.items;
            this.totalTopics = data.metadata.totalItems;
            this.currentPage = page;

            this.topicCache.set(this.currentPage, this.topics);
          }
        );
    }
  }
}
