import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-manage-reviews',
  templateUrl: 'manage-reviews.component.html',
  styleUrls: ['manage-reviews.component.css']
})

export class ManageReviewsComponent implements OnInit {
  private topicDeadline: string;
  private topic: Topic;
  private isEnableStatusOption = true;
  private isEnableSaveButton = false;
  private reviews :string [] = [];
  private selectedReviewOption: any;
  translatedResponse: any;
  reviewStatusOptions = ['NotReviewed', 'InReview', 'Reviewed'];

  private subscription: Subscription;
  private topicId: number;
  private errorMessage: any;
  private currentSupervisor: User;

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.subscription = this.route.params
      .subscribe(
        (params: any) => {
          this.topicId = +params['id'];
         }
      );
    this.userService.getCurrent()
      .then(
        (data: any) => this.currentSupervisor = <User> data,
        (error: any) => this.errorMessage = <any> error.error
      );
    this.getTopicData(this.topicId);
    this.getSupervisors();
  }

  private getSupervisors() {
    this.topicService.getReviewStatusOfCurrentUser(this.topicId)
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

  private selectReviewStatusOption(option: string){
    this.selectedReviewOption = option;
  }

  private editReviewStatus(){
    this.isEnableStatusOption = false;
    this.isEnableSaveButton = true;
  }

  private updateReviewStatus(){
    this.topicService.updateReviewerStatus(this.topicId,this.selectedReviewOption)
      .then(
        (response: any) => {
          this.toasterService.pop('success', 'Success', this.getTranslatedString('status has been saved'));
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.getTranslatedString('Error updating status') , error);
      }
    );
    this.isEnableSaveButton = false;
    this.isEnableStatusOption = true;
  }

  private getTopicData(topicId: number) {
    this.topicService.getTopic(topicId)
      .then(
        (response: any) => {
          this.topic = <Topic> response;
          this.topicDeadline = this.topic.deadline;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.getTranslatedString('Could not get the topic data') , error);
        this.router.navigate(['/error']);
      }
    );
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
