import { Component, Input, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

import { Topic } from '../../index';
import { TopicService } from '../../shared/topic.service';
import { User } from '../../../core/user/user.model';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'hip-topic-input',
  templateUrl: './app/topics/topic-management/topic-input/topic-input.component.html',
  styleUrls: ['./app/topics/topic-management/topic-input/topic-input.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TopicInputComponent),
    multi: true
  }]
})
export class TopicInputComponent implements OnInit {
  @Input() depthLeft = 0;
  @Input() depth = 0;
  @Input() showContent = true;
  @Input() topic: Topic = Topic.emptyTopic();
  @Input() currentParent: Topic = null;
  @Output() modelChange = new EventEmitter<Topic>();

  updateData() {
    this.modelChange.emit(this.topic);
  }

  students = '';
  subTopics: Topic[] = this.topic.subTopics;
  playAnimation = !this.showContent;

  constructor(private topicService: TopicService,
              private router: Router,
              private route: ActivatedRoute,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    if (this.topic.deadline !== null) {
      this.topic.deadline = this.topic.deadline.slice(0, 10);
    }
    this.playAnimation = !this.showContent;
    if (this.route.snapshot.url[0].path === 'topics') {
      let id = +this.route.snapshot.params['id']; // (+) converts string 'id' to a number
      this.topicService.getTopic(id).then(
        response => {
          this.topic = <Topic> response;
          if (this.topic.deadline !== null) {
            this.topic.deadline = this.topic.deadline.slice(0, 10);
          }
        }
      ).catch(
        error => this.toasterService.pop('error', 'Error fetching topic', error)
      );
      this.topicService.getStudentsOfTopic(id).then(
        response => this.topic.students = <User[]> response
      ).catch(
        error => this.toasterService.pop('error', 'Error fetching Students', error)
      );
      this.topicService.getReviewersOfTopic(id).then(
        response => this.topic.reviewers = <User[]> response
      ).catch(
        error => this.toasterService.pop('error', 'Error fetching Reviewers', error)
      );
      this.topicService.getSupervisorsOfTopic(id).then(
        response => this.topic.supervisors = <User[]>response
      ).catch(
        error => this.toasterService.pop('error', 'Error fetching Supervisors', error)
      );
      this.topicService.getSubTopics(id).then(
        response => this.topic.subTopics = <Topic[]> response
      ).catch(
        error => this.toasterService.pop('error', 'Error fetching SubTopics', error)
      );
    }
    console.log(this.topic);
  }

  toggleContent() {
    this.showContent = !this.showContent;
  };

  addSubTopic() {
    this.subTopics.push(Topic.emptyTopic([this.topic]));
  }

  addTopic() {

  }

  removeTopic() {
    if (this.currentParent !== null) {
      let index = this.currentParent.subTopics.indexOf(this.topic, 0);
      if (index > -1) {
        this.currentParent.subTopics.splice(index, 1);
      }
    }
  }

  public saveTopic(topicToSave: Topic) {
    console.log(topicToSave);
    if (topicToSave.id === -1) {
      this.topicService.createTopic(topicToSave)
        .then(
          response => this.handleResponseCreate(response)
        )
        .catch(
          error => this.handleError(error)
        );
    } else {
      this.topicService.updateTopic(topicToSave)
        .then(
          response => this.handleResponseUpdate(response)
        )
        .catch(
          error => this.handleError(error)
        );
    }
  }

  private handleResponseUpdate(response: Topic) {
    this.showToastSuccess('topic "' + this.topic.title + '" updated');
    if (this.subTopics === null) {
      return;
    }
    for (let subTopic of this.subTopics) {
      this.saveTopic(subTopic);
    }
  }

  private handleResponseCreate(response: Topic) {
    if (this.subTopics !== null) {
      if (this.subTopics.length > 0) {
        for (let subTopic of this.subTopics) {
          this.saveTopic(subTopic);
        }
      }
    }
    if (this.depth === 0) {
      this.showToastSuccess('topic "' + this.topic.title + '" saved');
      console.log(response);
      try {
        this.router.navigate(['/topics', response.id]);
      } catch (error) {
        console.log(error);
      }
    }
  }

  private handleError(error: string) {
    this.toasterService.pop('error', 'Error while saving', error);
  }

  private showToastSuccess(s2: string) {
    this.toasterService.pop('success', 'Success', s2);
  }
}
