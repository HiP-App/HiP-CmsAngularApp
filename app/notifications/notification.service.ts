import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { CmsApiService } from '../core/api/cms-api.service';
import { Notification } from './notification.model';

/**
 * Service for the notifications.
 */
@Injectable()
export class NotificationService {
  private notificationCountAnnouncedSource = new Subject<number>();
  notificationCountAnnounced$ = this.notificationCountAnnouncedSource.asObservable(); // Observable stream

  constructor(private cmsApiService: CmsApiService) {}

  /**
   * Get all notifications.
   * @return all notifications
   */
  public getAllNotifications() {
    return this.cmsApiService.getUrl('/Api/Notifications/All', {})
      .toPromise()
      .then(
        (response: any) => Notification.extractData(response)
      ).catch(
        (error: any) => this.handleError('Error during fetching all notifications', error)
      );
  }

  /**
   * Get all unread notifications.
   * @return unread notifications
   */
  public getUnreadNotifications() {
    return this.cmsApiService.getUrl('/Api/Notifications/Unread', {})
      .toPromise()
      .then(
        (response: any) => Notification.extractData(response)
      ).catch(
        (error: any) => this.handleError('Error during fetching unread notifications', error)
      );
  }

  /**
   * Get the number of unread notifications.
   * @return the number of unread notifications
   */
  public getUnreadNotificationsCount() {
    return this.cmsApiService.getUrl('/Api/Notifications/Count', {})
      .toPromise()
      .then(
        (response: any) => response._body
      ).catch(
        (error: any) => this.handleError('Error during fetching the number of unread notifications', error)
      );
  }

  /**
   * Mark a notification as read.
   * @param notificationId the id of the notification to mark as read
   */
  public markNotificationAsRead(notificationId: number) {
    return this.cmsApiService.postUrl('/Api/Notifications/' + notificationId + '/markread', '', {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError('Mark notification ' + notificationId + ' as read', error)
      );
  }

  private handleError(method: string, error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error);
    return Promise.reject(errMsg);
  }

  /**
   * Announce when notifications were marked as read
   * @param the number of notifications marked as read
   */
  announceUnreadNotificationCountDecrease(decrease: number) {
    this.notificationCountAnnouncedSource.next(decrease);
  }
}
