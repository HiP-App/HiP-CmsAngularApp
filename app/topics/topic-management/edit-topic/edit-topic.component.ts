import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { User } from '../../../core/user/user.model';

@Component({
  selector: 'hip-edit-topic',
  templateUrl: './app/topics/topic-management/shared/save-topic-view.component.html',
  styleUrls: ['./app/topics/topic-management/shared/save-topic-view.component.css']
})
export class EditTopicComponent implements OnInit {
  @Input() topic: Topic = Topic.emptyTopic();

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[1].path === 'edit') {
      let id = +this.route.snapshot.params['id']; // (+) converts string 'id' to a number

      this.topicService.getTopic(id).then(
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
  }

  saveTopic() {
    this.topicService.updateTopic(this.topic).then(
      (response: any) => this.handleResponseUpdate()
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error while saving', error)
    );
  }

  private getTopicDetails() {
    this.topicService.getStudentsOfTopic(this.topic.id).then(
      (response: any) => this.topic.students = <User[]> response
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching Students', error)
    );

    this.topicService.getReviewersOfTopic(this.topic.id).then(
      (response: any) => this.topic.reviewers = <User[]> response
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching Reviewers', error)
    );

    this.topicService.getSupervisorsOfTopic(this.topic.id).then(
      (response: any) => this.topic.supervisors = <User[]> response
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching Supervisors', error)
    );

    this.topicService.getSubTopics(this.topic.id).then(
      (response: any) => this.topic.subTopics = <Topic[]> response
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching SubTopics', error)
    );
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', 'Success', 'Topic "' + this.topic.title + '" updated');
  }
}
