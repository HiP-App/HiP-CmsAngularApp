import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { User } from '../../../core/user/user.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-topic',
  templateUrl: '../shared/save-topic-view.component.html',
  styleUrls: ['../shared/save-topic-view.component.css']
})
export class EditTopicComponent implements OnInit {
  @Input() topic: Topic = Topic.emptyTopic();
  dirtyFields: string[] = [];
  canSave = false;
  translatedResponse: any;

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private router: Router,
              private translateService: TranslateService) {}

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[1].path === 'edit') {
      let id = +this.route.snapshot.params['id']; // (+) converts string 'id' to a number

      this.topicService.getTopic(id)
        .then(
          (response: any) => {
            this.topic = <Topic> response;
            if (this.topic.deadline !== null) {
              this.topic.deadline = this.topic.deadline.slice(0, 10);
            }
            this.getTopicDetails();
          }
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Error fetching topic') , error);
          }
        );
    }
  }

  modelChanged(event: any) {
    this.canSave = true;
    if (this.dirtyFields.indexOf(event) === -1) {
      this.dirtyFields.push(event);
    }
  }

  saveTopic() {
    if (this.dirtyFields.indexOf('title') !== -1 ||
      this.dirtyFields.indexOf('status') !== -1 ||
      this.dirtyFields.indexOf('description') !== -1 ||
      this.dirtyFields.indexOf('requirements') !== -1) {
      this.topicService.updateTopic(this.topic)
        .then(
          (response: any) => this.handleResponseUpdate()
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Error while saving') , error);
          }
        );
    }
    this.saveTopicDetails();
  }

  private getTopicDetails() {
    this.topicService.getStudentsOfTopic(this.topic.id)
      .then(
        (response: any) => this.topic.students = <User[]> response
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching Students') , error);
        }
      );
    this.topicService.getReviewersOfTopic(this.topic.id)
      .then(
        (response: any) => this.topic.reviewers = <User[]> response
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching Reviewers') , error);
        }
      );
    this.topicService.getSupervisorsOfTopic(this.topic.id)
      .then(
        (response: any) => this.topic.supervisors = <User[]> response
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching Supervisors') , error);
        }
      );
    this.topicService.getSubTopics(this.topic.id)
      .then(
        (response: any) => this.topic.subTopics = <Topic[]> response
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching SubTopics') , error);
        }
      );
  }

  private saveTopicDetails() {
    if (this.dirtyFields.indexOf('students') !== -1) {
      let students: number[] = [];
      for (let student of this.topic.students) {
        students.push(student.id);
      }
      this.topicService.putStudentsOfTopic(this.topic.id, students)
        .then(
          (response: any) => this.handleResponseUpdate()
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Error while updating Students') , error);
          }
        );
    }

    if (this.dirtyFields.indexOf('supervisors') !== -1) {
      let users: number[] = [];
      for (let user of this.topic.supervisors) {
        users.push(user.id);
      }
      this.topicService.putSupervisorsOfTopic(this.topic.id, users)
        .then(
          (response: any) => this.handleResponseUpdate()
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Error while updating Supervisors') , error);
          }
        );
    }

    if (this.dirtyFields.indexOf('reviewer') !== -1) {
      let users: number[] = [];
      for (let user of this.topic.reviewers) {
        users.push(user.id);
      }
      this.topicService.putReviewersOfTopic(this.topic.id, users)
        .then(
          (response: any) => this.handleResponseUpdate()
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Error while updating Reviewers') , error);
          }
        );
    }
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', 'Success', this.topic.title + ' - ' + this.getTranslatedString('Topic updated'));
    setTimeout(() => {
      this.router.navigate(['/topics', this.topic.id]);
    }, 100);
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}
