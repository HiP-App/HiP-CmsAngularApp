import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyTopicsComponent } from './topics/my-topics-list.component';
import { ContactComponent } from './contact/contact.component';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import {ShowTopicComponent} from './topics/show-topic/show-topic.component';

@Component({
  selector: 'hip-app',
  template: '<hip-sidenav></hip-sidenav>',
  directives: [
    DashboardComponent,
    SidenavComponent,
    ROUTER_DIRECTIVES
  ],
  providers: [ROUTER_PROVIDERS]
})
@RouteConfig([
  {
    path: '/my-topics',
    name: 'MyTopics',
    component: MyTopicsComponent
  },
  {
    path: '/new-topic',
    name: 'NewTopic',
    component: ShowTopicComponent
  },
  // footer links
  {
    path: '/contact',
    name: 'Contact',
    component: ContactComponent
  },
  {
    path: '/help',
    name: 'Help',
    component: HelpComponent
  },
  {
    path: '/about',
    name: 'About',
    component: AboutComponent
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardComponent,
    useAsDefault: true
  },
])
export class AppComponent {
}
