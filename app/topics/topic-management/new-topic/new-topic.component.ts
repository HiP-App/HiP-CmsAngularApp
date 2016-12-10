import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { TranslateService } from 'ng2-translate';

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
  
  constructor(private topicService: TopicService,
              private router: Router,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  public saveTopic() {
    console.log(this.topic);
    this.topicService.createTopic(this.topic)
      .then(
        (response: any) => this.handleResponseCreate(response)
      )
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  modelChanged(event: any) {
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

  private handleResponseCreate(response: any) {
    if (response.success) {
      this.showToastSuccess(this.topic.title + ' - ' + this.getTranslatedString('Topic saved'));
      console.log(response);
      try {
        if (response.success) {
          this.saveUsers(response.value);
          this.router.navigate(['/topics', response.value]);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.toasterService.pop('error', 'Error', this.getTranslatedString('Error while saving'));
    }
  }

  private saveUsers(id: number) {
    if (this.updateReviewers) {
      let users: number[] = [];
      for (let user of this.topic.reviewers) {
        users.push(user.id);
      }
      this.topicService.putReviewersOfTopic(id, users);
    }
    if (this.updateSupervisors) {
      let users: number[] = [];
      for (let user of this.topic.supervisors) {
        users.push(user.id);
      }
      this.topicService.putSupervisorsOfTopic(id, users);
    }
    if (this.updateStudents) {
      let users: number[] = [];
      for (let user of this.topic.students) {
        users.push(user.id);
      }
      this.topicService.putStudentsOfTopic(id, users);
    }
  }

  private handleError(error: string) {
    this.toasterService.pop('error', this.getTranslatedString('Error while saving') , error);
  }

  private showToastSuccess(s2: string) {
    this.toasterService.pop('success', 'Success', s2);
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    )
    return this.translatedResponse;
  }

}
