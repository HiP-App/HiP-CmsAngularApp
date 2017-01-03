import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Notification } from '../notification.model';
import { TranslateService } from 'ng2-translate';

@Pipe({
  name: 'hipNotificationsFilter'
})
@Injectable()
export class NotificationsFilter implements PipeTransform {
  constructor(private translateService: TranslateService) {

  }
  transform(users: Notification[], query: string, criterion: string, notificationType: string): Notification[] {
    for (let entry of users) {
      let k  = this.translateService.instant(entry.text);
      //this.translateService.get(entry);
      console.log(k);
    }
    if (query !== '' && query !== undefined && users !== null) {
      if (criterion === 'Read') {
        debugger;
        //this.translateService.get(users[1].text);
        users = users.filter(
          notifications => (notifications.read == true && notifications.text.toLowerCase().indexOf(query.toLowerCase()) !== -1 || notifications.s1.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
      }else if (criterion === 'Unread') {
        users = users.filter(
          notifications => (notifications.read != true && notifications.text.toLowerCase().indexOf(query.toLowerCase()) !== -1 || notifications.s1.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
      } else if(criterion === 'all' && notificationType== 'all'){
        users = users.filter(
          notifications => (notifications.text.toLowerCase().indexOf(query.toLowerCase()) !== -1 || notifications.s1.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
      }
    }
    if(criterion === 'all'){
      users = users.filter(
        notifications => (notifications)
      );
    }

    if(criterion === 'Read'){
      users = users.filter(
        notifications => (notifications.read == true)
      );
    }

    if(criterion === 'Unread'){
      users = users.filter(
        notifications => (notifications.read != true)
      );
    }

    if (notificationType != 'all') {
      users = users.filter(
        notifications => (notifications.type == notificationType)
      );
    }

    return users;
  }
}

