import { Component, Input } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Notification } from '../notification.model';
import { NotificationService } from '../notification.service';

@Component({
  moduleId: module.id,
  selector: 'hip-notifications-list',
  templateUrl: 'notifications-list.component.html',
  styleUrls: ['notifications-list.component.css']
})
export class NotificationsListComponent {
  @Input() notifications: Notification[];
  @Input() selectedStatus: string = '';
  @Input() selectedNotificationType: string = '';
  getFilterSortingOptions: boolean = false;
  translatedResponse: any;

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    if(location.pathname == "/notifications"){
      this.getFilterSortingOptions = true;
    }
  }

  private markAsRead(notificationId: number) {
    this.notificationService.markNotificationAsRead(notificationId)
      .then(
        (response: any) => {
          let readNotification = this.notifications.filter(
            function (item) {
              return item.id === notificationId;
            }
          )[0];
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
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}
