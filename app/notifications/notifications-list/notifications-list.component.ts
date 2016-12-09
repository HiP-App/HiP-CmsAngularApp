import { Component, Input } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { Notification } from '../notification.model';
import { NotificationService } from '../notification.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'hip-notifications-list',
  templateUrl: './app/notifications/notifications-list/notifications-list.component.html',
  styleUrls: ['./app/notifications/notifications-list/notifications-list.component.css']
})
export class NotificationsListComponent {
  @Input() notifications: Notification[];
  translatedResponse: any;

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  private markAsRead(notificationId: number) {
    this.notificationService.markNotificationAsRead(notificationId)
      .then(
        (response: any) => {
          let readNotification = this.notifications.filter(function (item) {
            return item.id === notificationId
          })[0];
          readNotification.read = true;

          // notify change to the service which notifies the toolbar
          this.notificationService.announceUnreadNotificationCountDecrease(1);
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Could not mark notification as read'));
      }
    );
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    )
    return this.translatedResponse;
  }
}
