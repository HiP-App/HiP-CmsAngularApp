import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs';

import { Topic } from '../shared/topic.model';
import { TopicService } from '../shared/topic.service';
import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-show-topic',
  templateUrl: 'show-topic.component.html',
  styleUrls: ['show-topic.component.css']
})
export class ShowTopicComponent implements OnInit, OnDestroy {
  @Input() topic: Topic = Topic.emptyTopic();
  title = '';
  userCanDelete = false;
  userCanEditContent = false;
  userCanEditDetails = false;
  userCanAddSubtopic = false;
  addFromExisting = false;
  hideSearch = false;
  parentTopicId: number;
  translatedResponse: any;
  isSaveButtonDisabled = true;

  private subscription: Subscription;
  private topicId: number;
  private currentUser: User = User.getEmptyUser();

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.translateService.get('topic details')
      .subscribe(
        (response: string) => this.title = response
      );
    this.subscription = this.route.params
      .subscribe(
        (params: any) => {
          this.topicId = +params['id'];
          this.reloadTopic();
          this.checkUserPermissions();
        }
      );
    this.userService.getCurrent()
      .then(
        (response: User) => this.currentUser = response
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching current user') , error);
        }
      );
  }

  saveStudentReviewStatus() {
    this.topic.status = 'InReview';
    this.saveStatus();
  }

  saveStatus() {
    this.topicService.saveStatusofTopic(this.topic.id, this.topic.status)
      .then(
        (response: any) => this.handleResponseStatus(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
    this.isSaveButtonDisabled = true;
  }

  private reloadTopic() {
    this.topicService.getTopic(this.topicId)
      .then(
        (response: Topic) => {
          this.topic = response;
          if (this.topic.deadline !== null) {
            this.topic.deadline = this.topic.deadline.slice(0, 10);
          }
          this.getTopicDetails();
        }
      ).catch(
        (error: string) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching topic') , error);
          this.router.navigate(['/error']);
        }
      );
  }

  private getTopicDetails() {
    this.topicService.getStudentsOfTopic(this.topicId)
      .then(
        (response: any) => this.topic.students = <User[]> response
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching Students') , error);
        }
      );
    this.topicService.getReviewersOfTopic(this.topicId)
      .then(
        (response: any) => {
          this.topic.reviewers = <User[]> response;
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching Reviewers') , error);
        }
      );
    this.topicService.getSupervisorsOfTopic(this.topicId)
      .then(
        (response: any) => {
          this.topic.supervisors = <User[]> response;
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching Supervisors') , error);
        }
      );
    this.topicService.getSubTopics(this.topicId)
      .then(
        (response: any) => {
          this.topic.subTopics = <Topic[]> response;
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching SubTopics') , error);
        }
      );
    this.topicService.getParentTopics(this.topicId)
      .then(
        (response: any) => {
          this.topic.parentTopics = <Topic[]> response;
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching parent topics') , error);
        }
      );
  }

  private handleResponseStatus(response: any) {
    this.toasterService.pop('success', 'Success', this.topic.status + ' - ' + this.getTranslatedString('Status updated'));
  }

  private handleError(error: string) {
    this.toasterService.pop('error', this.getTranslatedString('Error while saving') , error);
  }

  addSubtopic() {
    this.parentTopicId = this.topic.id;
    this.addFromExisting = false;
  }

  addFromExitingTopic() {
    this.addFromExisting = true;
  }

  closeSearch() {
    this.addFromExisting = false;
  }

  removeSubtopic(subtopic: Topic) {
    this.topicService.deleteSubtopic(this.topic.id, subtopic.id)
      .then(
        (response: any) => {
          this.reloadTopic();
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  onNotify() {
    this.reloadTopic();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private checkUserPermissions() {
    this.topicService.currentUserCanEditTopicDetails(this.topicId)
      .then(
        (response: boolean) => {
          this.userCanEditDetails = response;
          this.userCanDelete = response;
          this.userCanAddSubtopic = response;
        }
      ).catch(
        (error: string) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching permissions') , error);
        }
      );
    this.topicService.currentUserCanEditTopicContent(this.topicId)
      .then(
        (response: boolean) => this.userCanEditContent = response
      ).catch(
        (error: string) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching permissions') , error);
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
