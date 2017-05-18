import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { dashboardRouting } from './dashboard.routing';
import { NotificationsModule } from '../notifications/notifications.module';
import { SharedModule } from '../shared/shared.module';
import { TopicModule } from '../topics/topics.module';

@NgModule({
  imports: [
    NotificationsModule,
    SharedModule,
    TopicModule,
    dashboardRouting
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
