import { Component, OnInit, OnDestroy } from '@angular/core';

import { TopicService } from '../shared/topic.service';
import { Topic } from '../shared/topic.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  moduleId: module.id,
  selector: 'hip-all-topics',
  styleUrls: ['all-topics.component.css'],
  templateUrl: 'all-topics.component.html'
})
export class AllTopicsComponent implements OnInit, OnDestroy {
  query = '';
  showingSearchResults = false;
  topics: Topic[];

  totalTopics: number;
  topicsPerPage = 10;
  currentPage = 1;

  private topicCache = new Map<number, Topic[]>();

  constructor(private topicService: TopicService, private spinnerService: NgxSpinnerService) {}

  ngOnInit() {
    this.spinnerService.show();
    this.getPage(1);
  }

  getPage(page: number) {
    if (this.topicCache.has(page)) {
      this.topics = this.topicCache.get(page);
      this.currentPage = page;
    } else {
      let onlyParents = this.query.trim().length < 1;
      this.topicService.getAllTopics(page, this.topicsPerPage, onlyParents, this.query)
        .then(
          data => {
            this.topics = data.items;
            this.totalTopics = data.metadata.totalItems;
            this.currentPage = page;

            this.topicCache.set(this.currentPage, this.topics);
            this.spinnerService.hide();
          }
        ).catch(
          error => {
            this.spinnerService.hide();
            console.error(error);
          }
        );
    }
  }

  ngOnDestroy() {
    this.spinnerService.hide();
  }

  findTopics() {
    if (this.query.trim().length > 0) {
      this.topics = undefined;
      this.topicCache.clear();
      this.getPage(1);
      this.showingSearchResults = true;
    }
  }

  resetSearch() {
    this.query = '';
    this.topics = undefined;
    this.topicCache.clear();
    this.getPage(1);
    this.showingSearchResults = false;
  }
}
