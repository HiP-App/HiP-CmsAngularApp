import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
  topics: Observable<Topic[]>;
  allTopics: Promise<Topic[]>;
  _total: number;
  _page: number;

  constructor(private topicService: TopicService,
              private cmsApiService: CmsApiService) {}

  ngOnInit() {
    this.getPage(1);
  }

  searchTopics() {
    if (this.query.length >= 1) {
      this.topicService.findTopic(this.query, this._page)
        .then(
          (response: any) => {
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
    return this.cmsApiService.getUrl('/api/Topics?page=' + page + '&onlyParents=' + true, {})
      .map(
        (response: any) => response.json().items
      ).subscribe(
        (data: any) => {
          this.topics = data;
          this._page = page;
        }
      );
  }
}
