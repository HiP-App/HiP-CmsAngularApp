import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { Notification } from '../notification.model';

@Pipe({
  name: 'hipNotificationsFilter'
})
@Injectable()
export class NotificationsFilter implements PipeTransform {
  transform(notifications: Notification[], criterion: string, notificationType: string): Notification[] {
    if (notifications !== null) {
      if (criterion === 'Read') {
        notifications = notifications.filter(
          notifications => (notifications.read == true)
        );
      } else if (criterion === 'Unread') {
        notifications = notifications.filter(
          notifications => (notifications.read != true)
        );
      } else if (criterion === 'all' && notificationType == 'all') {
        notifications = notifications.filter(
          notifications => (notifications)
        );
      }
    }
    if (criterion === 'all') {
      notifications = notifications.filter(
        notifications => (notifications)
      );
    }
    if (notificationType != 'all') {
      notifications = notifications.filter(
        notifications => (notifications.type == notificationType)
      );
    }
    return notifications;
  }
}
