import { Component, Input, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router } from '@angular/router-deprecated';
import { MdButton } from '@angular2-material/button';
import { MdCard } from '@angular2-material/card';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MdInput, MdHint } from '@angular2-material/input';
import {
  MD_RADIO_DIRECTIVES,
  MdRadioGroup,
  MdRadioButton,
  MdUniqueSelectionDispatcher
} from '@angular2-material/radio';

import { TextareaComponent } from '../../shared/textarea/textarea.component';
import { Topic } from '../index';
import { TopicService } from '../shared/topic.service';
import { CmsApiService } from '../../shared/api/cms-api.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserService } from '../../shared/user/user.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'hip-show-topic',
  viewProviders: [MdIconRegistry, HTTP_PROVIDERS],
  templateUrl: './app/topics/show-topic/show-topic.component.html',
  styleUrls: ['./app/topics/show-topic/show-topic.component.css'],
  directives: [
    MdButton,
    MdIcon,
    ROUTER_DIRECTIVES,
    MdInput,
    MdHint,
    MdCard,
    MD_RADIO_DIRECTIVES,
    MdRadioButton,
    MdRadioGroup,
    ShowTopicComponent,
    TextareaComponent,
  ],
  providers: [MdUniqueSelectionDispatcher, ROUTER_PROVIDERS,
    TopicService, CmsApiService, UserService]
})
export class ShowTopicComponent implements OnInit {
  @Input() depthLeft = 0;
  @Input() depth = 0;
  @Input() showContent = true;
  @Input() topic: Topic = Topic.emptyTopic();
  @Input() currentParent: Topic = null;
  students = '';
  subTopics: Topic[] = this.topic.subTopics;
  playAnimation = !this.showContent;
  disableEditing = true;

  constructor(private topicService: TopicService,
              private userService: UserService,
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
    }
    this.userService.getCurrent().then(
      user => {
        this.disableEditing = user.role !== 'Supervisor';
      }
    );
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
