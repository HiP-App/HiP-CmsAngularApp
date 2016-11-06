import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TopicService } from '../shared/topic.service';
import { Topic } from '../shared/topic.model';
import { ToasterService } from 'angular2-toaster';
import { CmsApiService } from '../../core/api/cms-api.service';

@Component({
  selector: 'hip-all-topics',
  templateUrl: './app/topics/all-topics/all-topics.component.html',
  styleUrls: ['./app/topics/all-topics/all-topics.component.css']
})


export class AllTopicsComponent implements OnInit {

  query: string = '';
  topics: Observable<Topic[]>;
  allTopics: Promise<Topic[]>;
  _total: number;
  _page: number;


  constructor(private topicService: TopicService, private cmsApiService: CmsApiService, private toasterService: ToasterService) {}

  ngOnInit() {
    this.getPage(1);
  }

  searchTopics() {
    if (this.query.length >= 1) {
      this.topicService.findTopic(this.query, this._page)
        .then((response: any) => {
          this.allTopics = response;
        })
        .catch((error: any) => {
          console.log('Error in searching topics');
        });
    }
  }

  getPage(page: number) {
    return this.cmsApiService.getUrl('/api/Topics?page=' + 1 + '&onlyParents=' + true, {})
      .map(response => response.json().items)
      .subscribe(
        data => {
          this.topics = data;
          this._page = page;
        }
      );
  }
}


