import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Notification } from '../notifications/notification.model';
import { NotificationService } from '../notifications/notification.service';

@Component({
  moduleId: module.id,
  selector: 'hip-notifications',
  templateUrl: 'notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  private notifications: Notification[] = [];
  private notificationsResponseHandled = false;
  translatedResponse: any;

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.notificationService.getAllNotifications()
      .then(
        (response: any) => {
          this.notifications = response;
          this.notificationsResponseHandled = true;
        }
      ).catch(
        (error: any) => {
          this.notificationsResponseHandled = true;
          this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your notifications'));
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
}
