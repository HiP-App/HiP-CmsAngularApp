import {Component, Input} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {MdButton} from '@angular2-material/button';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {MdInput, MdHint} from '@angular2-material/input';
import {MdCard} from '@angular2-material/card';
import {MD_RADIO_DIRECTIVES, MdRadioGroup, MdRadioButton, MdRadioDispatcher} from '@angular2-material/radio';

import {Topic} from "../shared/topic.model";
import {CONFIG} from "../../shared/config";

@Component({
  selector: 'hip-new-topic',
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
    ShowTopicComponent
  ],
  providers: [MdRadioDispatcher, ROUTER_PROVIDERS]
})
export class ShowTopicComponent {
  @Input() depthLeft = 0;
  @Input() depth = 0;
  @Input() showContent = true;
  @Input() topic:Topic = new Topic();
  students = '';
  subTopics:Topic[] = this.topic.subTopics;

  toggleContent() {
    this.showContent = !this.showContent;
  };

  addSubTopic() {
    this.subTopics.push(new Topic());
  }

  addTopic() {
    alert(CONFIG['apiUrl']);
  }
}
