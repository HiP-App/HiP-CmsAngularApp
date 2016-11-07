import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../shared/topic.model';
import { TopicService } from '../shared/topic.service';
import { User } from '../../core/user/user.model';

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
  private subscription: Subscription;
  private topicId: number;

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.translateService.get('topic details')
      .subscribe((response: string) => this.title = response);

    this.subscription = this.route.params
      .subscribe(params => {
        this.topicId = +params['id'];
        this.loadTopic();
        this.checkUserPermissions();
      });
  }

  private loadTopic() {
    this.topicService.getTopic(this.topicId)
      .then((response: Topic) => {
        this.topic = response;
        if (this.topic.deadline !== null) {
          this.topic.deadline = this.topic.deadline.slice(0, 10);
        }
        this.getTopicDetails();
      })
      .catch((error: string) => this.toasterService.pop('error', 'Error fetching topic', error));
  }

  private getTopicDetails() {
    this.topicService.getStudentsOfTopic(this.topicId)
      .then((response: User[]) => this.topic.students = response)
      .catch((error: string) => this.toasterService.pop('error', 'Error fetching Students', error));

    this.topicService.getReviewersOfTopic(this.topicId)
      .then((response: User[]) => this.topic.reviewers = response)
      .catch((error: string) => this.toasterService.pop('error', 'Error fetching Reviewers', error));

    this.topicService.getSupervisorsOfTopic(this.topicId)
      .then((response: User[]) => this.topic.supervisors = response)
      .catch((error: string) => this.toasterService.pop('error', 'Error fetching Supervisors', error));

    this.topicService.getSubTopics(this.topicId)
      .then((response: Topic[]) => this.topic.subTopics = response)
      .catch((error: string) => this.toasterService.pop('error', 'Error fetching SubTopics', error));

    this.topicService.getParentTopics(this.topicId)
      .then((response: Topic[]) => this.topic.parentTopics = response)
      .catch((error: string) => this.toasterService.pop('error', 'Error fetching SubTopics', error));
  }

  private checkUserPermissions() {
    this.topicService.currentUserCanEditTopicDetails(this.topicId)
      .then((response: boolean) => {
        this.userCanEditDetails = response;
        this.userCanDelete = response;
      })
      .catch((error: string) => this.toasterService.pop('error', 'Error fetching permissions', error));

    this.topicService.currentUserCanEditTopicContent(this.topicId)
      .then((response: boolean) => this.userCanEditContent = response)
      .catch((error: string) => this.toasterService.pop('error', 'Error fetching permissions', error));
  }
}
