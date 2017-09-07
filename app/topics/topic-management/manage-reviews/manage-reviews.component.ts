import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { TopicService } from '../../shared/topic.service';
import { User } from '../../../users/user.model';
import { UserService } from '../../../users/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-manage-reviews',
  templateUrl: 'manage-reviews.component.html',
  styleUrls: ['manage-reviews.component.css']
})

export class ManageReviewsComponent implements OnInit {
  @Input() topicId: number;
  private isEnableStatusOption = true;
  private isEnableSaveButton = false;
  private reviews: string [] = [];
  private selectedReviewOption: any;
  reviewStatusOptions = ['NotReviewed', 'InReview', 'Reviewed'];

  private subscription: Subscription;
  private errorMessage: any;
  private currentSupervisor: User;

  constructor(private topicService: TopicService,
              private userService: UserService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.userService.getCurrent()
      .then(
        (data: any) => this.currentSupervisor = <User> data,
        (error: any) => this.errorMessage = <any> error.error
      );
    this.getSupervisors();
  }

  private getSupervisors() {
    this.topicService.getTopicReviews(this.topicId)
      .then(
        (response: any) => {
          this.reviews = JSON.parse(response);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while getting status') , error);
        }
      );
  }

  private selectReviewStatusOption(option: string) {
    this.selectedReviewOption = option;
  }

  private editReviewStatus() {
    this.isEnableStatusOption = false;
    this.isEnableSaveButton = true;
  }

  private updateReviewStatus() {
    this.topicService.updateReviewerStatus(this.topicId, this.selectedReviewOption)
      .then(
        (response: any) => {
          this.toasterService.pop('success', this.getTranslatedString('status has been saved'));
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.getTranslatedString('Error updating status'), error);
      }
    );
    this.isEnableSaveButton = false;
    this.isEnableStatusOption = true;
  }

  getTranslatedString(data: any) {
    let translatedResponse: any;
    this.translateService.get(data).subscribe(
      (value: any) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }
}
