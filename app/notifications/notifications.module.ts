import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { notificationRouting } from './notifications.routing';

import { NotificationsComponent } from './notifications.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationService } from './notification.service';

import { NotificationsFilter } from './pipes/notification-filter.pipe';
import { NotificationsSorter } from './pipes/notification-sort.pipe';

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
    NotificationsFilter,
    NotificationsSorter
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
