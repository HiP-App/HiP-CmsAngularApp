import { Component, Input, OnInit,EventEmitter, Output } from '@angular/core';
import { Response, } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs';

import { TopicService } from '../../shared/topic.service';
import { CmsApiService } from '../../../core/api/cms-api.service';
import { Topic } from '../../shared/topic.model';

@Component({
  selector: 'hip-new-subtopic',
  templateUrl: './app/topics/topic-management/add-subtopic/add-subtopic.component.html',
  styleUrls: ['./app/topics/topic-management/shared/save-topic-view.component.css', './app/topics/topic-management/add-subtopic/add-subtopic.component.css']
})
export class NewSubtopicComponent {
  @Input() addFromExisting: boolean;
  @Input() parentTopicForExisting = Topic.emptyTopic();
  @Input() subtopics: Topic[];
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  query: string = '';
  topic = Topic.emptyTopic();
  allTopics: Promise<Topic[]>;
  parentTopic = Topic.emptyTopic();
  topics: Observable<Topic[]>;
  parentTopicId: number
  errorMessage: any;
  allFilteredTopics: Topic[] = [];

  constructor(private topicService: TopicService,
    private cmsApiService: CmsApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: ToasterService) {

    this.parentTopic.subTopics = [];
  }

  ngOnInit() {
    console.log(this.parentTopicForExisting)
    if(!this.addFromExisting) {
      if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[2].path === 'new-subtopic') {
        let id = +this.route.snapshot.params['id']; // (+) converts string 'id' to a number
        this.parentTopicId = id;
      }
    }
  }

  private searchTopics() {
    this.errorMessage = null;
    if (this.query.length >= 1) {
      this.topicService.findTopic(this.query, 1)
      .then((response: any) => {
        console.log(response.json().items)
        this.allTopics = response;
     //   this.filterTopics(response);        
      })
      .catch((error: any) => {
        console.log('Error in searching topics');
      });
    }
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
    this.allTopics = topics;
  }


public getAllTopics(page = 1, onlyParents = false,  deadline = '', status = '') {
  if (this.query.length >= 1) {
    return this.cmsApiService.getUrl('/api/Topics?page=' +
      page + '&onlyParents=' + onlyParents + '&query=' + this.query +
      '&deadline=' + deadline + '&status=' + status, {})
      .map(
        (response: any) => {
          Topic.extractPaginationedArrayData(response)
          this.filterTopics(response.json().items);
        }
      ).subscribe(
        (data:any) => {
          this.allFilteredTopics = data;
        }
      );
     }
  }

  public saveTopic() {
    this.topicService.createTopic(this.topic)
    .then(
      (response: any) => {
        this.topic.id = response.value
        this.handleResponseCreate(response)
        this.handleResponseUpdate(this.topic.id);
      }
      )
    .catch(
      (error: any) => this.handleError(error)
      );
  }

  private handleResponseCreate(response: any) {
    if (response.success) {
      this.showToastSuccess('topic "' + this.topic.id + '" saved');
      try {
        this.router.navigate(['/topics', response.value]);
      } catch (error) {
        console.log(error);
      }
    } 
    else {
      this.toasterService.pop('error', 'Error while saving', response.errorMessage);
    }
  }

  private handleResponseUpdate(subtopicId: number) {
    console.log(subtopicId)
    this.topicService.updateParentOfTopic(this.parentTopicId, subtopicId)
    .then(
      (response:any) => this.toasterService.pop('success', 'Success', 'Topic "' + this.parentTopicId + '" updated')
      )
    .catch(
      (error:any) => this.toasterService.pop('error', 'Error while saving', error)
      )
  }

  private addExistingTopic(existingTopic: Topic) {
    this.topicService.updateParentOfTopic(this.parentTopicForExisting.id, existingTopic.id) 
    .then(
      (response:any) => {
        this.notify.emit(this.parentTopicForExisting);
        this.toasterService.pop('success', 'Success', 'Topic "' + this.parentTopicForExisting.title + '" updated');
      }
      )
    .catch(
      (error:any) => {
        this.toasterService.pop('error', 'Subtopic '+existingTopic.title+' exist already for topic '+this.parentTopicForExisting.title)
        this.errorMessage = error;
      }
      )
  }

  private handleError(error: string) {
    this.toasterService.pop('error', 'Error while saving', error);
  }

  private showToastSuccess(s2: string) {
    this.toasterService.pop('success', 'Success', s2);
  }
}
