import { Component, Input } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { MdButton } from '@angular2-material/button';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MdInput, MdHint } from '@angular2-material/input';
import { MdCard } from '@angular2-material/card';
import { MD_RADIO_DIRECTIVES, MdRadioGroup, MdRadioButton, MdRadioDispatcher } from '@angular2-material/radio';

@Component({
  selector: 'hip-new-topic',
  viewProviders: [MdIconRegistry, HTTP_PROVIDERS],
  templateUrl: './app/topics/new-topic/new-topic.component.html',
  styleUrls: ['./app/topics/new-topic/new-topic.component.css'],
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
    NewTopicComponent
  ],
  providers: [MdRadioDispatcher]
})
export class NewTopicComponent {
  @Input() depthLeft = 5;
  @Input() depth = 0;
  @Input() showContent = true;
  students = '';

  toggleContent() {
    this.showContent = !this.showContent;
  };
}
