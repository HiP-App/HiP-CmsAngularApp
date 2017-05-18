import { NgModule } from '@angular/core';

import { notificationRouting } from './notifications.routing';
import { NotificationsComponent } from './notifications.component';
import { NotificationsFilter } from './pipes/notification-filter.pipe';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationService } from './notification.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    notificationRouting,
    SharedModule
  ],
  declarations: [
    NotificationsComponent,
    NotificationsListComponent,
    NotificationsFilter
  ],
  exports: [
    NotificationsListComponent
  ],
  providers: [
    NotificationService
  ]
})
export class NotificationsModule { }
