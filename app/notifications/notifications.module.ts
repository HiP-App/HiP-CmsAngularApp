import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { notificationRouting } from './notifications.routing';
import { NotificationsComponent } from './notifications.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationService } from './notification.service';
import { NotificationsFilter } from './pipes/notification-filter.pipe';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
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
    NotificationService,
    MdUniqueSelectionDispatcher
  ]
})
export class NotificationsModule { }
