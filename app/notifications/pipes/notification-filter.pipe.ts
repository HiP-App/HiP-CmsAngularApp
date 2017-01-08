import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { Notification } from '../notification.model';

@Pipe({
  name: 'hipNotificationsFilter'
})
@Injectable()
export class NotificationsFilter implements PipeTransform {
  transform(notifications: Notification[], status: string, notificationType: string): Notification[] {
    if (notifications !== null) {
      if (status === 'Read') {
        notifications = notifications.filter(
          (notification: Notification) => (notification.read)
        );
      } else if (status === 'Unread') {
        notifications = notifications.filter(
          (notification: Notification) => (!notification.read)
        );
      }
    }
    if (notificationType !== 'All') {
      notifications = notifications.filter(
        (notification: Notification) => (notification.type === notificationType)
      );
    }
    return notifications;
  }
}
