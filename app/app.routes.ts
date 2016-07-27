import { provideRouter, RouterConfig }  from '@angular/router';

import { AboutComponent } from './about/about.component';
import { AuthGuard } from './shared/auth/auth-guard';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HelpComponent } from './help/help.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { NewTopicComponent, MyTopicsComponent } from './topics/index';
import { ShowTopicComponent } from './topics/show-topic/show-topic.component';
import { AllTopicsComponent } from './topics/all-topics/all-topics-list.component';


const routes: RouterConfig = [
  {
    path: '',
    redirectTo: '/dashboard',
    terminal: true
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-topics',
    component: MyTopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'topics/:id',
    component: ShowTopicComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new-topic',
    component: NewTopicComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'all-topics',
    component: AllTopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  // footer links
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'help',
    component: HelpComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
];

export const hipRouterProviders = [
  provideRouter(routes)
];