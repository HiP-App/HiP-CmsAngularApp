import { Component, OnInit } from '@angular/core';
import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { User } from '../../../core/user/user.model';

@Component({
  selector: 'hip-edit-topic',
  templateUrl: './app/topics/topic-management/shared/save-topic-view.component.html',
  styleUrls: ['./app/topics/topic-management/shared/save-topic-view.component.css']
})
export class EditTopicComponent implements OnInit {
  topic: Topic = Topic.emptyTopic();

  constructor(private topicService: TopicService,
              private router: Router,
              private route: ActivatedRoute,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    if (this.topic.deadline !== null) {
      this.topic.deadline = this.topic.deadline.slice(0, 10);
    }
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[1].path === 'edit') {
      let id = +this.route.snapshot.params['id']; // (+) converts string 'id' to a number
      this.topicService.getTopic(id).then(
        (response: any) => {
          this.topic = <Topic> response;
          if (this.topic.deadline !== null) {
            this.topic.deadline = this.topic.deadline.slice(0, 10);
          }
        }
      ).catch(
        (error: any) => this.toasterService.pop('error', 'Error fetching topic', error)
      );
      this.topicService.getStudentsOfTopic(id).then(
        (response: any) => {
          console.log('fetched students');
          this.topic.students = <User[]> response;
          console.log(this.topic.students);
          this.topic = this.topic;
        }
      ).catch(
        (error: any) => this.toasterService.pop('error', 'Error fetching Students', error)
      );
      this.topicService.getReviewersOfTopic(id).then(
        (response: any) => this.topic.reviewers = <User[]> response
      ).catch(
        (error: any) => this.toasterService.pop('error', 'Error fetching Reviewers', error)
      );
      this.topicService.getSupervisorsOfTopic(id).then(
        (response: any) => this.topic.reviewers = <User[]> response
      ).catch(
        (error: any) => this.toasterService.pop('error', 'Error fetching Supervisors', error)
      );
      this.topicService.getSubTopics(id).then(
        (response: any) => this.topic.subTopics = <Topic[]> response
      ).catch(
        (error: any) => this.toasterService.pop('error', 'Error fetching SubTopics', error)
      );
    }
    console.log(this.topic);
  }

  public saveTopic() {
    console.log(this.topic);
    this.topicService.updateTopic(this.topic)
      .then(
        (response: any) => this.handleResponseUpdate()
      )
      .catch(
        (error: any) => this.toasterService.pop('error', 'Error while saving', error)
      );
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', 'Success', 'topic "' + this.topic.title + '" updated');
  }
}