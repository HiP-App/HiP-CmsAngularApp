import { Component, OnInit } from '@angular/core';
import { ToasterService } from "angular2-toaster";

import { Notification } from "../notifications/notification.model";
import { NotificationService } from "../notifications/notification.service";

@Component({
  selector: 'hip-notifications',
  templateUrl: './app/notifications/notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  private notifications: Notification[] = [];
  private notificationsResponseHandled = false;

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    this.notificationService.getAllNotifications()
      .then(
        (response: any) => {
          this.notifications = response;
          this.notificationsResponseHandled = true;
        }
      )
      .catch(
        (error: any) => {
          this.notificationsResponseHandled = true;
          this.toasterService.pop( 'error', 'Error', 'Not able to fetch your notifications.');
        }
      );
  }
}