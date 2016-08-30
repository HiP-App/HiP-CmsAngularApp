import { ModuleWithProviders, provide, PLATFORM_PIPES } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthService } from './shared/auth/auth.service';
import { ApiService } from './shared/api/api.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CmsApiService } from './shared/api/cms-api.service';
import { UserService } from './shared/user/user.service';
import { AuthHttp, provideAuth } from 'angular2-jwt';
import { TRANSLATION_PROVIDERS } from './shared/translate/translations';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { MyTopicsComponent } from './topics/my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './topics/new-topic/new-topic.component';
import { AdminComponent } from './admin/admin.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'my-topics',
    component: MyTopicsComponent
  },
  {
    path: 'new-topic',
    component: NewTopicComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  // footer links
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'help',
    component: HelpComponent
  }
];

export const appRoutingProviders: any[] = [
  AuthService,
  ApiService,
  CmsApiService,
  UserService,
  TRANSLATION_PROVIDERS,
  TranslateService, // inject our services
  provide(PLATFORM_PIPES, { useValue: [TranslatePipe], multi: true }), // application wide pipe
  AuthHttp,
  provideAuth({
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    tokenName: 'id_token',
    tokenGetter: (() => localStorage.getItem('id_token')),
    globalHeaders: [{ 'Content-Type': 'application/x-www-form-urlencoded' }],
    noJwtError: true,
    noTokenScheme: true
  })
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
