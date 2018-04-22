import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Notification } from '../notifications/notification.model';
import { NotificationService } from '../notifications/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  moduleId: module.id,
  selector: 'hip-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notifications: Notification[] = [];
  private notificationsResponseHandled = false;
  translatedResponse: any;
  selectedStatus = 'All';
  notificationStatusOptions = ['All', 'Read', 'Unread'];
  notificationTypes = ['All', 'TOPIC_CREATED', 'TOPIC_ASSIGNED_TO', 'TOPIC_REMOVED_FROM', 'TOPIC_STATE_CHANGED',
    'TOPIC_DEADLINE_CHANGED', 'TOPIC_DELETED', 'TOPIC_UPDATED', 'TOPIC_ATTACHMENT_ADDED'];
  selectedNotificationType = 'All';

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private spinnerService: NgxSpinnerService) {}

  ngOnInit() {
    this.spinnerService.show();
    this.notificationService.getAllNotifications()
      .then(
        (response: any) => {
          this.spinnerService.hide();
          this.notifications = response;
          this.notificationsResponseHandled = true;
        }
      ).catch(
        (error: any) => {
          this.spinnerService.hide();
          this.notificationsResponseHandled = true;
          this.toasterService.pop('error', this.getTranslatedString('Not able to fetch your notifications'));
        }
      );
  }

  ngOnDestroy() {
    this.spinnerService.hide();
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
