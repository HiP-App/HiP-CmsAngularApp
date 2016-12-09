import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { Notification } from '../notifications/notification.model';
import { NotificationService } from '../notifications/notification.service';
import { Topic } from '../topics/shared/topic.model';
import { TopicService } from '../topics/shared/topic.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'hip-dashboard',
  templateUrl: './app/dashboard/dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private notifications: Notification[] = [];
  private notificationsResponseHandled = false;

  private topics: Topic[] = [];
  private topicsResponseHandled = false;
  translatedResponse: any;

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService,
              private topicService: TopicService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.notifications = [];
    this.notificationService.getUnreadNotifications()
      .then(
        (response: any) => {
          this.notifications = response;
          this.notificationsResponseHandled = true;
        }
      ).catch(
      (error: any) => {
        this.notificationsResponseHandled = true;
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your notifications'));
      }
    );

    this.topicService.getAllTopicsOfCurrentUser()
      .then(
        (response: any) => {
          this.topics = response;
          this.topicsResponseHandled = true;
        }
      ).catch(
      (error: any) => {
        this.topicsResponseHandled = true;
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your topics'));
      }
    );
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    )
    return this.translatedResponse;
  }
}
