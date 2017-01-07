import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Notification } from '../notifications/notification.model';
import { NotificationService } from '../notifications/notification.service';

@Component({
  moduleId: module.id,
  selector: 'hip-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  private notifications: Notification[] = [];
  private notificationsResponseHandled = false;
  translatedResponse: any;
  selectedStatus: string = 'all';
  notificationStatusOptions = ['All', 'Read', 'Unread'];
  notificationTypes = ['All', 'TOPIC_CREATED', 'TOPIC_ASSIGNED_TO', 'TOPIC_REMOVED_FROM', 'TOPIC_STATE_CHANGED',
    'TOPIC_DEADLINE_CHANGED', 'TOPIC_DELETED', 'TOPIC_UPDATED', 'TOPIC_ATTACHMENT_ADDED'];
  selectedNotificationType: string = 'all';

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
