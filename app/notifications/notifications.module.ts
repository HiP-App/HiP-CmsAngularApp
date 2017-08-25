import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdCardModule, MdIconModule, MdListModule, MdSelectModule } from '@angular/material';
import { TranslateModule } from 'ng2-translate';

import { notificationRouting } from './notifications.routing';
import { NotificationsComponent } from './notifications.component';
import { NotificationsFilter } from './pipes/notification-filter.pipe';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationService } from './notification.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdCardModule,
    MdIconModule,
    MdListModule,
    MdSelectModule,
    notificationRouting,
    TranslateModule
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
