import { Injectable } from '@angular/core';

import { Notification } from './notification.model';
import { CmsApiService } from '../core/api/cms-api.service';

/**
 * Service for the notifications.
 */
@Injectable()
export class NotificationService {

  constructor(private cmsApiService: CmsApiService) {
  }

  public getNotifications() {
    return this.cmsApiService.getUrl('/Api/Notifications', {})
      .toPromise()
      .then(
        (response: any) => {
          Notification.extractData(response)
        }
      ).catch(
        (error: any) => {
          console.log('error in getNotifications');
        }
      );
  }

  public markNotificationAsRead(notificationId: number) {
    return this.cmsApiService.postUrl('/Api/Notifications/' + notificationId + '/markread', '', {})
      .toPromise()
      .then(
        (response: any) => {
          console.log(response);
          return true;
        }
      )
      .catch(
        (error: any) => {
          console.log(error);
          return false;
        }
      );
  }
}
