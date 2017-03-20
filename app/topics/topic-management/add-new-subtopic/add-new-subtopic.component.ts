import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { NewTopicComponent } from '../new-topic/new-topic.component';
import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';

@Component({
  moduleId: module.id,
  selector: 'hip-new-subtopic',
  templateUrl: 'add-new-subtopic.component.html',
  styleUrls: ['../shared/save-topic-view.component.css']
})
export class AddNewSubtopicComponent extends NewTopicComponent implements OnInit {
  topic = Topic.emptyTopic();
  parentTopic = Topic.emptyTopic();
  errorMessage: any;
  translatedResponse: any;
  headlineString = 'new topic as subtopic of {{parent}}';

  constructor(topicService: TopicService,
              router: Router,
              private route: ActivatedRoute,
              toasterService: ToasterService,
              translateService: TranslateService) {
    super(topicService, router, toasterService, translateService);
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[2].path === 'new-subtopic') {
      let parentTopicId = +this.route.snapshot.params['id']; // (+) converts string 'id' to a number

      this.topicService.getTopic(parentTopicId)
        .then(
          (response: Topic) => {
            this.parentTopic = response;
          }
        ).catch(
          (error: string) => {
            this.router.navigate(['/error']);
          }
      );
    }
  }

  public saveTopic() {
    this.topicService.createTopic(this.topic)
      .then(
        (response: any) => {
          this.handleResponseCreate(response);
          this.updateParent(response.value);
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  handleResponseCreate(response: any) {
    if (response.success) {
      this.toasterService.pop('success', 'Success', this.topic.title + ' - ' + this.getTranslatedString('Topic saved'));
      try {
        let topicId = response.value;

        this.topicService.putReviewersOfTopic(topicId, this.topic.reviewers.map(user => user.email));

        this.topicService.putSupervisorsOfTopic(topicId, this.topic.supervisors.map(user => user.email));

        this.topicService.putStudentsOfTopic(topicId, this.topic.students.map(user => user.email));

        this.router.navigate(['/topics', this.parentTopic.id]);
      } catch (error) {
        console.error(error);
      }
    } else {
      this.toasterService.pop('error', 'Error', this.getTranslatedString('Error while saving'));
    }
  }

  private updateParent(subtopicId: number) {
    this.topicService.addSubtopicToTopic(this.parentTopic.id, subtopicId)
      .catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while updating'), error);
        }
      );
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}
