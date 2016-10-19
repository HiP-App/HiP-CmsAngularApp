import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Topic } from '../shared/topic.model';
import { TopicService } from '../shared/topic.service';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { User } from '../../core/user/user.model';
import { Subscription } from 'rxjs';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'hip-show-topic',
  templateUrl: './app/topics/show-topic/show-topic.component.html',
  styleUrls: ['./app/topics/show-topic/show-topic.component.css']
})
export class ShowTopicComponent implements OnInit, OnDestroy {
  @Input() topic: Topic = Topic.emptyTopic();
  private subscription: Subscription;
  private topicId: number;
  title = '';

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
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
  }

  reloadTopic() {
    this.topicService.getTopic(this.topicId).then(
      (response: any) => {
        this.topic = <Topic> response;
        if (this.topic.deadline !== null) {
          this.topic.deadline = this.topic.deadline.slice(0, 10);
        }
        this.getTopicDetails();
      }
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching topic', error)
    );
  }

  private getTopicDetails() {
    this.topicService.getStudentsOfTopic(this.topicId).then(
      (response: any) => {
        this.topic.students = <User[]> response;
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
