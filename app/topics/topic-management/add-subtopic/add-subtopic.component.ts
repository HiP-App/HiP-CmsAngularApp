import { Component, Input, OnInit } from '@angular/core';
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
  styleUrls: ['./app/topics/topic-management/shared/save-topic-view.component.css']
})
export class NewSubtopicComponent {
  @Input() addFromExisting: boolean;
  @Input() parentTopicForExisting = Topic.emptyTopic();

  query: string = '';
  topic = Topic.emptyTopic();
  allTopics: Promise<Topic[]>;
  parentTopic = Topic.emptyTopic();
  topics: Observable<Topic[]>;
  parentTopicId: number

  constructor(private topicService: TopicService,
    private cmsApiService: CmsApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: ToasterService) {

    this.parentTopic.subTopics = [];
  }

  ngOnInit()
  {
    console.log(this.parentTopicForExisting)
     if(!this.addFromExisting) {
       console.log(this.addFromExisting)
      if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[2].path === 'new-subtopic') {
      let id = +this.route.snapshot.params['id']; // (+) converts string 'id' to a number
      console.log(id);
      this.parentTopicId = id;
    }
    }
  }

   private searchTopics() {
    if (this.query.length >= 1) {
      console.log("Inside search topic")
      this.topicService.findTopic(this.query, 1)
        .then((response: any) => {
          this.allTopics = response;
          console.log(this.allTopics)
        })
        .catch((error: any) => {
          console.log('Error in searching topics');
        });
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
      console.log(this.topic);
      try {
        this.router.navigate(['/topics', response.value]);
        setTimeout(4000);
      } catch (error) {
        console.log(error);
      }
    } else {
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
    console.log(existingTopic)
    console.log(this.parentTopicForExisting.id)
    this.topicService.updateParentOfTopic(this.parentTopicForExisting.id, existingTopic.id) 
    .then(
      (response:any) => this.toasterService.pop('success', 'Success', 'Topic "' + this.parentTopicForExisting.title + '" updated')
      )
    .catch(
      (error:any) => this.toasterService.pop('error', 'Error while saving', error)
      )
  }

  private handleError(error: string) {
    this.toasterService.pop('error', 'Error while saving', error);
  }

  private showToastSuccess(s2: string) {
    this.toasterService.pop('success', 'Success', s2);
  }
}
