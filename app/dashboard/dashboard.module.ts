import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdCardModule } from '@angular/material';
import { TranslateModule } from 'ng2-translate';

import { DashboardComponent } from './dashboard.component';
import { dashboardRouting } from './dashboard.routing';
import { NotificationsModule } from '../notifications/notifications.module';
import { TopicModule } from '../topics/topics.module';

@NgModule({
  imports: [
    CommonModule,
    MdCardModule,
    NotificationsModule,
    TopicModule,
    TranslateModule,
    dashboardRouting
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
