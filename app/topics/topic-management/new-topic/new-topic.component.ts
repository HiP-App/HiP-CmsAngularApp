import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'hip-new-topic',
  templateUrl: './app/topics/topic-management/shared/save-topic-view.component.html',
  styleUrls: ['./app/topics/topic-management/shared/save-topic-view.component.css']
})
export class NewTopicComponent {
  topic: Topic = Topic.emptyTopic();
  canSave = true;
  private updateStudents = false;
  private updateSupervisors = false;
  private updateReviewers = false;
  translatedResponse: any;
  getTranslatedData: any;

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
      this.getTranslatedData = this.translatedData('Topic saved');
      this.showToastSuccess(this.topic.title + ' - ' + this.getTranslatedData);
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
      this.getTranslatedData = this.translatedData('Error while saving');
      this.toasterService.pop('error', 'Error', this.getTranslatedData);
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
    this.getTranslatedData = this.translatedData('Error while saving');
    this.toasterService.pop('error', this.getTranslatedData, error);
  }

  private showToastSuccess(s2: string) {
    this.toasterService.pop('success', 'Success', s2);
  }

  translatedData(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    )
    return this.translatedResponse;
  }

}
