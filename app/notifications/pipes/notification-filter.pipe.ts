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
          notifications => (notifications.read)
        );
      } else if (status === 'Unread') {
        notifications = notifications.filter(
          notifications => (notifications.read !== true)
        );
      } else if (status === 'all' && notificationType === 'all') {
        notifications = notifications.filter(
          notifications => (notifications)
        );
      }
    }
    if (status === 'all') {
      notifications = notifications.filter(
        notifications => (notifications)
      );
    }
    if (notificationType !== 'all') {
      notifications = notifications.filter(
        notifications => (notifications.type == notificationType)
      );
    }
    return notifications;
  }
}
