import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Notification } from '../notifications/notification.model';
import { NotificationService } from '../notifications/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MdSelectChange } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy, OnChanges {
  private notifications: Notification[] = [];
  private filteredNotifications: Notification[] = [];
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
          this.notifications = response.array;
          this.filteredNotifications = this.filterNotifications();
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

  filterNotifications() {
    let filtered = [];
    if (this.selectedStatus === 'All') {
      filtered = this.notifications;
    } else {
      let boolRead = this.selectedStatus === 'Read';
      filtered = this.notifications.filter((notification) => {
        return (notification.read === boolRead);
      });
    }

    if (this.selectedNotificationType !== 'All') {
      filtered = filtered.filter((notification) => {
        return (notification.type === this.selectedNotificationType);
      });
    }

    return filtered;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filteredNotifications = this.filterNotifications();
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }

  onNotificationTypeChange(event: MdSelectChange) {
    this.filteredNotifications = this.filterNotifications();
  }

  onStatusChange(event: MdSelectChange) {
    this.filteredNotifications = this.filterNotifications();
  }
}
