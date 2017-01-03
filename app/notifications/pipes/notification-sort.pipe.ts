import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Notification } from '../notification.model';

@Pipe({
  name: 'hipNotificationSorter'
})

@Injectable()

export class NotificationsSorter implements PipeTransform {
  transform(users: any, key: string, direction: number): Notification[] {
    if (key !== '' && users !== null) {
      users.sort((a: any, b: any) => {
        if (a[key] < b[key]) {
          return -1 * direction;
        } else if (a[key] > b[key]) {
          return 1 * direction;
        } else {
          return 0;
        }
      });
    }
    return users;
  }
}
