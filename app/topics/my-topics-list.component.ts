import {Component, ViewEncapsulation} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdCard} from '@angular2-material/card';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {MdList, MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdSidenav, MdSidenavLayout} from '@angular2-material/sidenav';

@Component({
    selector: 'hip-my-topics',
    template: `
        <md-card class="topics">
          <h2>{{langYourTopics}}</h2>
          <md-nav-list>
            <md-list-item *ngFor="let topic of topics">
              <h2 md-line>{{topic.title}}</h2>
              <p md-line>{{topic.content}}</p>
            </md-list-item>
          </md-nav-list>
        </md-card>
        `,
    directives: [MdCard, MdList, MD_LIST_DIRECTIVES],
    viewProviders: [MdIconRegistry, HTTP_PROVIDERS],
})
export class MyTopicsComponent {
    langYourTopics = 'Your topics';
    topics = [
        {
            'title': 'History in Paderborn"',
            'content': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
        },
        {
            'title': 'The three rabbits',
            'content': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
        },
        {
            'title': 'Cathedral of Paderborn',
            'content': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
        }
    ];
}