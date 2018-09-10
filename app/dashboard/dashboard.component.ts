import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { Notification } from '../notifications/notification.model';
import { NotificationService } from '../notifications/notification.service';
import { Topic } from '../topics/shared/topic.model';
import { TopicService } from '../topics/shared/topic.service';
import { TranslateService } from 'ng2-translate';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  moduleId: module.id,
  selector: 'hip-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private notifications: Notification[] = [];
  private notificationsResponseHandled = false;
  private topics: Topic[] = [];
  private topicsResponseHandled = false;
  translatedResponse: any;

  constructor(private notificationService: NotificationService,
              private toasterService: ToasterService,
              private topicService: TopicService,
              private translateService: TranslateService,
              private spinnerService: NgxSpinnerService) {}

  ngOnInit() {
    this.notifications = [];
    this.spinnerService.show();
    this.notificationService.getUnreadNotifications()
      .then(
        (response: any) => {
          this.spinnerService.hide();
          this.notifications = response.array;
          this.notificationsResponseHandled = true;
        }
      ).catch(
        (error: any) => {
          this.spinnerService.hide();
          this.notificationsResponseHandled = true;
          this.toasterService.pop('error', this.getTranslatedString('Not able to fetch your notifications'));
        }
      );

    this.spinnerService.show();
    this.topicService.getAllTopicsOfCurrentUser()
      .then(
        (response: any) => {
          this.spinnerService.hide();
          this.topics = response;
          this.topicsResponseHandled = true;
        }
      ).catch(
        (error: any) => {
          this.spinnerService.hide();
          this.topicsResponseHandled = true;
          this.toasterService.pop('error', this.getTranslatedString('Not able to fetch your topics'));
        }
      );
  }

  ngOnDestroy() {
    this.spinnerService.hide();
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}
