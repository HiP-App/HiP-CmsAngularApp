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
          notification => (notification.read)
        );
      } else if (status === 'Unread') {
        notifications = notifications.filter(
          notification => (notification.read !== true)
        );
      } else if (status === 'all' && notificationType === 'all') {
        notifications = notifications.filter(
          notification => (notification)
        );
      }
    }
    if (status === 'all') {
      notifications = notifications.filter(
        notification => (notification)
      );
    }
    if (notificationType !== 'all') {
      notifications = notifications.filter(
        notification => (notification.type === notificationType)
      );
    }
    return notifications;
  }
}
