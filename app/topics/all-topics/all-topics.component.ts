import { Component, OnInit } from '@angular/core';

import { TopicService } from '../shared/topic.service';
import { Topic } from '../shared/topic.model';

@Component({
  moduleId: module.id,
  selector: 'hip-all-topics',
  styleUrls: ['all-topics.component.css'],
  templateUrl: 'all-topics.component.html'
})
export class AllTopicsComponent implements OnInit {
  query = '';
  showingSearchResults = false;
  topics: Topic[] = [];

  totalTopics: number;
  topicsPerPage = 10;
  currentPage = 1;

  private topicCache = new Map<number, Topic[]>();

  constructor(private topicService: TopicService) {}

  ngOnInit() {
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
          }
        ).catch(
          error => console.error(error)
        );
    }
  }

  findTopics() {
    this.topicCache.clear();
    this.getPage(1);
    this.showingSearchResults = true;
  }

  resetSearch() {
    this.query = '';
    this.topicCache.clear();
    this.getPage(1);
    this.showingSearchResults = false;
  }
}
