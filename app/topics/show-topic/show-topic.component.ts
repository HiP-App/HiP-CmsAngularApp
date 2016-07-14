import { Component, Input, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
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
  providers: [MdUniqueSelectionDispatcher, ROUTER_PROVIDERS]
})
export class ShowTopicComponent implements OnInit {
  @Input() depthLeft = 0;
  @Input() depth = 0;
  @Input() showContent = true;
  @Input() topic: Topic = Topic.emptyTopic();
  @Input() currentParent: Topic = null;
  students = '';
  subTopics: Topic[] = this.topic.subTopics;
  dueDateString: string;
  playAnimation = !this.showContent;

  ngOnInit() {
    if (typeof(this.topic.deadline) === Date.toString()) {
      this.dueDateString = this.topic.deadline.toISOString().slice(0, 10);
    }
    this.playAnimation = !this.showContent;
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

}
