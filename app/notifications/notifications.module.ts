import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { notificationRouting } from './notifications.routing';
import { NotificationsComponent } from './notifications.component';
import { NotificationsFilter } from './pipes/notification-filter.pipe';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationService } from './notification.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TagInputModule,
    TranslateModule,
    notificationRouting
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
