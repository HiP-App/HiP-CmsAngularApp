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

  public getAllNotifications() {
    return this.cmsApiService.getUrl('/Api/Notifications/All', {})
      .toPromise()
      .then(
        (response: any) => Notification.extractData(response)
      ).catch(
        (error: any) => this.handleError('Error during fetching all notifications', error)
      );
  }

  public getUnreadNotifications() {
    return this.cmsApiService.getUrl('/Api/Notifications/Unread', {})
      .toPromise()
      .then(
        (response: any) => Notification.extractData(response)
      ).catch(
        (error: any) => this.handleError('Error during fetching unread notifications', error)
      );
  }

  public markNotificationAsRead(notificationId: number) {
    return this.cmsApiService.postUrl('/Api/Notifications/' + notificationId + '/markread', '', {})
      .toPromise()
      .then(
        (response: any) => response.status
      ).catch(
        (error: any) => this.handleError('Mark notification ' + notificationId + ' as read', error)
      );
  }

  private handleError(method: string, error: any) {
    console.log('Error in ' + method);
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(error);
    return Promise.reject(errMsg);
  }
}
