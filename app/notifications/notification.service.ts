import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { CmsApiService } from '../shared/api/cms-api.service';
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
   * With this function the User is able to get all available notifications
   * @param page the page number
   * @param pageSize the number of Notifications on one page
   * @returns {Promise<AllEntities<Notifications>>} returns a AllEntities object that contains all available notifications
   */
  public getAllNotifications(currentPage = 1, pageSize = 0, status = 'ALL') {
    return this.cmsApiService.getUrl('/Api/Notifications/' + status, {})
      .toPromise()
      .then(
        (response: any) => {
          let body = response.json();
          let notifications: Notification[] = [];
          if (pageSize === 0) {
            pageSize = body.length;
           }
          for (let i = (currentPage - 1) * pageSize ; i < currentPage * pageSize && i < body.length; i++) {
            notifications.push(Notification.parseJSON(body[i]));
          }
          return {
            array : notifications,
            total : body.length
          };
        }
      ).catch(
        (error: any) => this.handleError('Error during fetching all notifications', error)
      );
  }
  /**
   * Returns all notification types the current user is subscribed to.
   */
  public getSubscribedTypes() {
    return this.cmsApiService.getUrl('/Api/Notifications/Subscriptions', {})
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError('Error fetching subscriptions', error)
      );
  }

  /**
   * Returns all notification types.
   */
  public getTypes() {
    return this.cmsApiService.getUrl('/Api/Notifications/Types', {})
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError('Error fetching notification types', error)
      );
  }

  /**
   * Get all unread notifications.
   * @return unread notifications
   */
  public getUnreadNotifications(currentPage = 1, pageSize = 0) {
   return this.cmsApiService.getUrl('/Api/Notifications/Unread', {})
      .toPromise()
      .then(
        (response: any) => 
        {
          let body = response.json();
          let notifications: Notification[] = [];
          if (pageSize === 0) {
            pageSize = body.length;
           }
          for (let i = (currentPage - 1) * pageSize ; i < currentPage * pageSize && i < body.length; i++) {
            notifications.push(Notification.parseJSON(body[i]));
          }
          return {
            array : notifications,
            total : body.length
          };
        }
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

  /**
   * Subscribes the current user to the provided notification type.
   * @param notificationType the type of notification to subscribe to
   */
  public subscribeType(notificationType: string) {
    return this.cmsApiService.putUrl('/Api/Notifications/subscribe/' + notificationType, '', {})
      .toPromise()
      .catch(
        (error: any) => this.handleError('Subscription failed', error)
      );
  }

  /**
   * Unsubscribes the current user from the provided notification type.
   * @param notificationType the type of notification to unsubscribe from
   */
  public unsubscribeType(notificationType: string) {
    return this.cmsApiService.putUrl('/Api/Notifications/unsubscribe/' + notificationType, '', {})
      .toPromise()
      .catch(
        (error: any) => this.handleError('Error while unsubscribing', error)
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
