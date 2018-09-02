import { Component, Input, EventEmitter } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Notification } from '../notification.model';
import { NotificationService } from '../notification.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  moduleId: module.id,
  selector: 'hip-notifications-list',
  templateUrl: 'notifications-list.component.html',
  styleUrls: ['notifications-list.component.css']
})
export class NotificationsListComponent {
  @Input() notifications: Notification[];
  translatedResponse: any;

   // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;   // must be fetched from server

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  private markAsRead(notificationId: number) {
    this.notificationService.markNotificationAsRead(notificationId)
      .then(
        (response: any) => {
          let readNotification = this.notifications.filter(
            function (item) {
              return item.id === notificationId;
            }
          )[0];
          readNotification.read = true;

          // notify change to the service which notifies the toolbar
          this.notificationService.announceUnreadNotificationCountDecrease(1);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Could not mark notification as read'));
        }
      );
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }

  private fetchNotification() {
    this.notifications = [];
    this.totalItems = undefined;
    this.notificationService.getAllNotifications(this.currentPage, this.pageSize)
    .then(
        response => {
          this.notifications = response.array;
          this.totalItems = response.total;
        }
      ).catch(
        
      );
  }

  reloadList() {
    this.currentPage = 1;
    this.fetchNotification();
  }

  getPage(page: number) {
    this.currentPage = page;
    this.fetchNotification();
  }
}

