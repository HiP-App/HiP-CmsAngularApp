import { Component, Input } from '@angular/core';
import { ToasterService } from "angular2-toaster";

import { Notification } from '../notification.model';
import { NotificationService } from "../notification.service";

@Component({
  selector: 'hip-notifications-list',
  templateUrl: './app/notifications/notifications-list/notifications-list.component.html',
  styleUrls: ['./app/notifications/notifications-list/notifications-list.component.css']
})
export class NotificationsListComponent {
  @Input() notifications: Notification[];
  
  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService) {
  }
  
  private markAsRead(notificationId: number) {
    this.notificationService.markNotificationAsRead(notificationId)
      .then(
        (response: any) => {
          let readNotification = this.notifications.filter(function (item) {return item.id === notificationId})[0];
          readNotification.read = true;
        }
      ).catch(
        (error: any) => {
          console.log(error);
          this.toasterService.pop('error', 'Error', 'Could not mark notification as read!');
        }
      );
  }
}
