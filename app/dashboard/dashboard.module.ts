import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';

import { dashboardRouting } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { SharedModule } from '../shared/shared.module';
import { TopicModule } from '../topics/topics.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NotificationsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    TopicModule,
    dashboardRouting
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
