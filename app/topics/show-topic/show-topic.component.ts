import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Topic } from '../shared/topic.model';
import { TopicService } from '../shared/topic.service';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';
import { Subscription } from 'rxjs';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'hip-show-topic',
  templateUrl: './app/topics/show-topic/show-topic.component.html',
  styleUrls: ['./app/topics/show-topic/show-topic.component.css']
})
export class ShowTopicComponent implements OnInit, OnDestroy {
  @Input() topic: Topic = Topic.emptyTopic();
  title = '';
  userCanDelete: boolean = false;
  userCanEditDetails: boolean = false;
  statusChange: boolean = false;
  showStatustoStudents: boolean = true;
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
    this.translateService.get('topic details').subscribe(
      (res: string) => this.title = res
    );
    this.subscription = this.route.params
      .subscribe(params => {
        this.topicId = +params['id'];
        this.reloadTopic();
      });

    // fetch current user and check permissions
    this.userService.getCurrent().then(
      (response: any) => {
        this.currentUser = <User> response;
        this.checkUserPermissions();
      }
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching current user', error)
    );
  }

  getStatusChange() {
    this.showStatustoStudents = false;
    this.statusChange = false;
  }

  saveStatus() {
    this.topicService.saveStatusofTopic(this.topic.id, this.topic.status).then(
      (response: any) => this.handleResponseStatus(response)
    ).catch(
      (error: any) => this.handleError(error)
    );
  }

  reloadTopic() {
    this.topicService.getTopic(this.topicId).then(
      (response: any) => {
        this.topic = <Topic> response;
        if (this.topic.deadline !== null) {
          this.topic.deadline = this.topic.deadline.slice(0, 10);
        }
        this.getTopicDetails();
        this.checkUserPermissions();
      }
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching topic', error)
    );
  }

  private getTopicDetails() {
    this.topicService.getStudentsOfTopic(this.topicId).then(
      (response: any) => {
        this.topic.students = <User[]> response;
        for (var studentId of this.topic.students) {
          if (studentId.id === this.currentUser.id) {
            this.statusChange = true;
            console.log(this.currentUser.id); // 9,2,5
          }
        }
      }
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching Students', error)
    );
    this.topicService.getReviewersOfTopic(this.topicId).then(
      (response: any) => {
        this.topic.reviewers = <User[]> response;
      }
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching Reviewers', error)
    );
    this.topicService.getSupervisorsOfTopic(this.topicId).then(
      (response: any) => {
        this.topic.supervisors = <User[]> response;
      }
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching Supervisors', error)
    );
    this.topicService.getSubTopics(this.topicId).then(
      (response: any) => this.topic.subTopics = <Topic[]> response
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching SubTopics', error)
    );
    this.topicService.getParentTopics(this.topicId).then(
      (response: any) => this.topic.parentTopics = <Topic[]> response
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching SubTopics', error)
    );
  }

  private handleResponseStatus(response: any) {
    this.toasterService.pop('success', 'Success', 'Status "' + this.topic.status + '" updated');
  }

  private handleError(error: string) {
    this.toasterService.pop('error', 'Error while saving', error);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private checkUserPermissions() {
    // admin permissions
    if (this.currentUser.role === 'Administrator') {
      this.userCanDelete = true;
      this.userCanEditDetails = true;
    }

    // supervisor permissions
    if (this.currentUser.role === 'Supervisor' && this.topic.createdById === this.currentUser.id) {
      this.userCanDelete = true;
      this.userCanEditDetails = true;
    }

    // Student permissions
    if (this.currentUser.role === 'Student' && this.statusChange === true) {
      this.showStatustoStudents = false;
    }
  }
}
