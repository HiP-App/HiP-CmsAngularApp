import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';

@Component({
  moduleId: module.id,
  selector: 'hip-new-topic',
  templateUrl: '../shared/save-topic-view.component.html',
  styleUrls: ['../shared/save-topic-view.component.css']
})
export class NewTopicComponent {
  topic: Topic = Topic.emptyTopic();
  canSave = true;
  private updateStudents = false;
  private updateSupervisors = false;
  private updateReviewers = false;
  translatedResponse: any;

  constructor(public topicService: TopicService,
              public router: Router,
              public toasterService: ToasterService,
              public translateService: TranslateService) {}

  public saveTopic() {
    this.topicService.createTopic(this.topic)
      .then(
        (response: any) => this.handleResponseCreate(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  modelChanged(event: any) {
    console.log(event);
    switch (event) {
      case 'students':
        this.updateStudents = true;
        break;
      case 'supervisors':
        this.updateSupervisors = true;
        break;
      case 'reviewers':
        this.updateReviewers = true;
        break;
      default:
        // do nothing
    }
  }

  handleResponseCreate(response: any) {
    if (response.success) {
      this.showToastSuccess(this.topic.title + ' - ' + this.getTranslatedString('Topic saved'));
      try {
        if (response.success) {
          this.saveUsers(response.value);
          this.router.navigate(['/topics', response.value]);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      this.toasterService.pop('error', this.getTranslatedString('Error while saving'));
    }
  }

  private saveUsers(id: number) {
    if (this.updateReviewers) {
      this.topicService.putReviewersOfTopic(id, this.topic.reviewers.map(user => user.email));
    }
    if (this.updateSupervisors) {
      this.topicService.putSupervisorsOfTopic(id, this.topic.supervisors.map(user => user.email));
    }
    if (this.updateStudents) {
      this.topicService.putStudentsOfTopic(id, this.topic.students.map(user => user.email));
    }
  }

  handleError(error: string) {
    this.toasterService.pop('error', this.getTranslatedString('Error while saving') , error);
  }

  private showToastSuccess(s2: string) {
    this.toasterService.pop('success', s2);
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
