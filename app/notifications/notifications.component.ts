import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { Notification } from '../notifications/notification.model';
import { NotificationService } from '../notifications/notification.service';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'hip-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notification.component.css']
})
export class NotificationsComponent implements OnInit {
  private notifications: Notification[] = [];
  private notificationsResponseHandled = false;
  translatedResponse: any;
  selectedStatus: string = 'all';
  notificationStatusOptions = ['Read', 'Unread'];
  notificationTypes = ['TOPIC_CREATED', 'TOPIC_ASSIGNED_TO', 'TOPIC_REMOVED_FROM', 'TOPIC_STATE_CHANGED','TOPIC_DEADLINE_CHANGED', 'TOPIC_DELETED', 'TOPIC_UPDATED', 'TOPIC_ATTACHMENT_ADDED' ]
  query: string = '';
  selectedNotificationType: string = 'all';
  key: string = '';
  direction: number = -1;

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

  selectStatus(statusOption: string) {
    this.selectedStatus = statusOption;
  }

  selectNotificationType(notificationType: string) {
    this.selectedNotificationType = notificationType;
  }

  sort(value: string) {
    this.direction = this.direction * (-1);
    this.key = value;
  }


}