import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { Notification } from '../notifications/notification.model';
import { NotificationService } from '../notifications/notification.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'hip-notifications',
  templateUrl: './app/notifications/notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  private notifications: Notification[] = [];
  private notificationsResponseHandled = false;
  translatedResponse: any;

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
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
          this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your notifications'));
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