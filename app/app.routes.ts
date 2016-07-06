import { provideRouter, RouterConfig }  from '@angular/router';

import { AboutComponent } from './about/about.component';
import { AuthGuard } from './shared/auth/auth-guard';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HelpComponent } from './help/help.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { NewTopicComponent, MyTopicsComponent } from './topics/index';


export const routes: RouterConfig = [
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
    path: 'new-topic',
    component: NewTopicComponent,
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

export const HIP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
