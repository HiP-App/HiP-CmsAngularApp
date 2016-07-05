import { Component } from '@angular/core';
import { MdCard } from '@angular2-material/card';
import { MdList, MD_LIST_DIRECTIVES } from '@angular2-material/list';

import { ShowTopicComponent, Topic } from '../index';

@Component({
  selector: 'hip-my-topics',
  templateUrl: './app/topics/my-topics-list/my-topics-list.component.html',
  styleUrls: ['./app/topics/my-topics-list/my-topics-list.component.css'],
  directives: [MdCard, MdList, MD_LIST_DIRECTIVES, ShowTopicComponent],
})
export class MyTopicsComponent {
  langYourTopics = 'Your topics';
  content = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod ' +
    'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ' +
    'accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus ' +
    'est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed ' +
    'diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
    'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ' +
    'sanctus est Lorem ipsum dolor sit amet.\n' +
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod ' +
    'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ' +
    'accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus ' +
    'est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed ' +
    'diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
    'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ' +
    'sanctus est Lorem ipsum dolor sit amet.';
  topics = [
    new Topic('Title 1', 'Luigi, Mario', 'Bowser', '100-200 words, 2 images', 'In Progress', 'Bowser',
      this.content, 'A Story about the browsers of Marios world', new Date('2015-11-12')),
    new Topic('Title 2', 'Luigi, Mario', 'Bowser', '300-400 words, 2 images', 'Done', 'Bowser',
      this.content, 'A Story about the browsers of Marios world but deeper', new Date())
  ];
}
