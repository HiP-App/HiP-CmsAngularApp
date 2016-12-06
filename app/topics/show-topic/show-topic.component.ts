import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../shared/topic.model';
import { TopicService } from '../shared/topic.service';
import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'hip-show-topic',
  templateUrl: './app/topics/show-topic/show-topic.component.html',
  styleUrls: ['./app/topics/show-topic/show-topic.component.css']
})
export class ShowTopicComponent implements OnInit, OnDestroy {
  @Input() topic: Topic = Topic.emptyTopic();
  title: string = '';
  userCanDelete: boolean = false;
  userCanEditContent: boolean = false;
  userCanEditDetails: boolean = false;
  userCanAddSubtopic: boolean = false;
  addFromExisting = false;
  hideSearch = false;
  parentTopicId: number;
  translatedResponse: any;
  getTranslatedData: any;

  private subscription: Subscription;
  private topicId: number;
  private currentUser: User = User.getEmptyUser();

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private userService: UserService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.translateService.get('topic details')
      .subscribe((response: string) => this.title = response);

    this.subscription = this.route.params
      .subscribe(params => {
        this.topicId = +params['id'];
        this.reloadTopic();
        this.checkUserPermissions();
      });

    this.userService.getCurrent()
      .then((response: User) => this.currentUser = response)
      .catch((error: any) => {
          this.getTranslatedData = this.translatedData('Error fetching current user');
          this.toasterService.pop('error', this.getTranslatedData, error);
        }
      );
  }

  saveStatus() {
    this.topicService.saveStatusofTopic(this.topic.id, this.topic.status).then(
      (response: any) => this.handleResponseStatus(response)
    ).catch(
      (error: any) => this.handleError(error)
    );
  }

  private reloadTopic() {
    this.topicService.getTopic(this.topicId)
      .then((response: Topic) => {
        this.topic = response;
        if (this.topic.deadline !== null) {
          this.topic.deadline = this.topic.deadline.slice(0, 10);
        }
        this.getTopicDetails();
      })
      .catch((error: string) => {
          this.getTranslatedData = this.translatedData('Error fetching topic');
          this.toasterService.pop('error', this.getTranslatedData, error);
        }
      );
  }

  private getTopicDetails() {
    this.topicService.getStudentsOfTopic(this.topicId).then(
      (response: any) => {
        this.topic.students = <User[]> response;
      }
    ).catch((error: any) => {
        this.getTranslatedData = this.translatedData('Error fetching Students');
        this.toasterService.pop('error', this.getTranslatedData, error);
      }
    );
    this.topicService.getReviewersOfTopic(this.topicId).then(
      (response: any) => {
        this.topic.reviewers = <User[]> response;
      }
    ).catch(
      (error: any) => {
        this.getTranslatedData = this.translatedData('Error fetching Reviewers');
        this.toasterService.pop('error', this.getTranslatedData, error);
      }
    );
    this.topicService.getSupervisorsOfTopic(this.topicId).then(
      (response: any) => {
        this.topic.supervisors = <User[]> response;
      }
    ).catch(
      (error: any) => {
        this.getTranslatedData = this.translatedData('Error fetching Supervisors');
        this.toasterService.pop('error', this.getTranslatedData, error);
      }
    );
    this.topicService.getSubTopics(this.topicId).then(
      (response: any) => this.topic.subTopics = <Topic[]> response
    ).catch(
      (error: any) => {
        this.getTranslatedData = this.translatedData('Error fetching SubTopics');
        this.toasterService.pop('error', this.getTranslatedData, error);
      }
    );
    this.topicService.getParentTopics(this.topicId).then(
      (response: any) => this.topic.parentTopics = <Topic[]> response
    ).catch(
      (error: any) => {
        this.getTranslatedData = this.translatedData('Error fetching parent topics');
        this.toasterService.pop('error', this.getTranslatedData, error);
      }
    );
  }

  private handleResponseStatus(response: any) {
    this.getTranslatedData = this.translatedData('Status updated');
    this.toasterService.pop('success', 'Success', this.topic.status + ' - ' + this.getTranslatedData);
  }

  private handleError(error: string) {
    this.getTranslatedData = this.translatedData('Error while saving');
    this.toasterService.pop('error', this.getTranslatedData, error);
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
      )
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  onNotify() {
    this.reloadTopic()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private checkUserPermissions() {
    this.topicService.currentUserCanEditTopicDetails(this.topicId)
      .then((response: boolean) => {
        this.userCanEditDetails = response;
        this.userCanDelete = response;
        this.userCanAddSubtopic = response;
      })
      .catch((error: string) => {
          this.getTranslatedData = this.translatedData('Error fetching permissions');
          this.toasterService.pop('error', this.getTranslatedData, error);
        }
      );

    this.topicService.currentUserCanEditTopicContent(this.topicId)
      .then((response: boolean) => this.userCanEditContent = response)
      .catch((error: string) => {
          this.getTranslatedData = this.translatedData('Error fetching permissions');
          this.toasterService.pop('error', this.getTranslatedData, error);
        }
      );
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
