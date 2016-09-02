import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthService } from './core/auth/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CmsApiService } from './core/api/cms-api.service';
import { UserService } from './core/user/user.service';
import { AuthHttp, provideAuth } from 'angular2-jwt';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './core/guards/auth-guard';
import { SupervisorGuard } from './core/guards/supervisor-guard';
import { AdminGuard } from './core/guards/admin-guard';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { AuthApiService } from './core/api/auth-api.service';

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
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard]
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
  disableDeprecatedForms(),
  provideForms(),
  AuthService,
  AuthApiService,
  CmsApiService,
  UserService,
  AuthGuard,
  SupervisorGuard,
  AdminGuard,
  AuthHttp,
  provideAuth({
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    tokenName: 'id_token',
    tokenGetter: (() => localStorage.getItem('id_token')),
    globalHeaders: [{ 'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*' }],
    noJwtError: true,
    noTokenScheme: true
  })
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
