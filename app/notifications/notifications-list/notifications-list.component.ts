import { Component, Input, EventEmitter, SimpleChanges } from '@angular/core';
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
  @Input() selectedStatus: String;
  @Input() selectedNotificationType: String;
  translatedResponse: any;

   // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;   // must be fetched from server

  // will contain the notification satisfying the selected status and type
  filteredNotifications: Notification[] = [];

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  private markAsRead(notificationId: number) {
    this.notificationService.markNotificationAsRead(notificationId)
      .then(
        (response: any) => {
          let readNotification = this.notifications.filter(
            function (notification) {
              return notification.id === notificationId;
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

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedStatus === 'All') {
      this.filteredNotifications = this.notifications;
    } else {
      let boolRead = this.selectedStatus === 'Read';
      this.filteredNotifications = this.notifications.filter((notification) => {
        return (notification.read === boolRead);
      });
    }

    if (this.selectedNotificationType !== 'All') {
      this.filteredNotifications = this.filteredNotifications.filter((notification) => {
        return (notification.type === this.selectedNotificationType);
      });
    }

    this.totalItems = this.filteredNotifications.length;
    this.currentPage = 1;
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }

  getPage(page: number) {
    this.currentPage = page;
  }
}
