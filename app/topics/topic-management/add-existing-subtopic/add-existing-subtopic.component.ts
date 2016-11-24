import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs';

import { TopicService } from '../../shared/topic.service';
import { CmsApiService } from '../../../core/api/cms-api.service';
import { Topic } from '../../shared/topic.model';

@Component({
  selector: 'hip-add-existing-subtopic',
  templateUrl: './app/topics/topic-management/add-existing-subtopic/add-existing-subtopic.component.html',
  styleUrls: ['./app/topics/topic-management/add-existing-subtopic/add-existing-subtopic.component.css']
})
export class AddExistingSubtopicComponent {
  @Input() show: boolean;
  @Input() parent = Topic.emptyTopic();
  @Input() subtopics: Topic[];
  @Output() showChange: EventEmitter<boolean>;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  query: string = '';
  topic = Topic.emptyTopic();
  searchResults: Topic[];
  parentTopic = Topic.emptyTopic();
  topics: Observable<Topic[]>;
  errorMessage: any;

  constructor(private topicService: TopicService,
              private cmsApiService: CmsApiService,
              private toasterService: ToasterService) {

    this.parentTopic.subTopics = [];
    this.showChange = new EventEmitter<boolean>();
  }

  hideComponent() {
    this.show = false;
    this.showChange.emit(this.show);
  }

  private filterTopics(topics:any) {
    let i =0;
    let j=0;
    for(i=0; i<this.subtopics.length;i++) {
      for(j=0; j<topics.length; j++) {
        if(this.subtopics[i].id === topics[j].id) {
          topics.splice(j, 1);
          break;
        }
      }
    }
    this.searchResults = topics;
  }

  public searchTopics(page = 1, onlyParents = false,  deadline = '', status = '') {
    if (this.query.length >= 1) {
      return this.cmsApiService.getUrl('/api/Topics?page=' +
        page + '&onlyParents=' + onlyParents + '&query=' + this.query +
        '&deadline=' + deadline + '&status=' + status, {})
        .map(
          (response: any) => {
            Topic.extractPaginationedArrayData(response)
            this.filterTopics(response.json().items);
          }
        ).subscribe();
    }
  }

  addExistingTopic(topic: Topic) {
    this.topicService.addSubtopicToTopic(this.parent.id, topic.id)
      .then(
        (response: any) => {
          this.notify.emit(this.parent);
          let index = this.searchResults.indexOf(topic);
          this.searchResults.splice(index, 1);
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Subtopic ' + topic.title + ' exist already for topic ' + this.parent.title)
      }
    )
  }
}
