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
    let test = this.notificationService.markNotificationAsRead(notificationId);
		console.log(test);
  }
}