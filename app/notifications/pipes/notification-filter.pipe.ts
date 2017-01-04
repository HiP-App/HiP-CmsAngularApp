import {Injectable, Pipe, PipeTransform} from '@angular/core';

import {Notification} from '../notification.model';

@Pipe({
  name: 'hipNotificationsFilter'
})
@Injectable()
export class NotificationsFilter implements PipeTransform {
  transform(notifications: Notification[], query: string, criterion: string, notificationType: string): Notification[] {
    if (query !== '' && query !== undefined && notifications !== null) {
      if (criterion === 'Read') {
        debugger;
        //this.translateService.get(users[1].text);
        notifications = notifications.filter(
          notifications => (notifications.read == true && notifications.text.toLowerCase().indexOf(query.toLowerCase()) !== -1 || notifications.s1.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
      } else if (criterion === 'Unread') {
        notifications = notifications.filter(
          notifications => (notifications.read != true && notifications.text.toLowerCase().indexOf(query.toLowerCase()) !== -1 || notifications.s1.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
      } else if (criterion === 'all' && notificationType == 'all') {
        notifications = notifications.filter(
          notifications => (notifications.text.toLowerCase().indexOf(query.toLowerCase()) !== -1 || notifications.s1.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
      }
    }
    if (criterion === 'all') {
      notifications = notifications.filter(
        notifications => (notifications)
      );
    }

    if (criterion === 'Read') {
      notifications = notifications.filter(
        notifications => (notifications.read == true)
      );
    }

    if (criterion === 'Unread') {
      notifications = notifications.filter(
        notifications => (notifications.read != true)
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


