import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { TopicService } from '../../shared/topic.service';
import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-reviewer-status',
  templateUrl: 'reviewer-status.component.html',
  styleUrls: ['reviewer-status.component.css']
})

export class ReviewersListComponent implements OnInit {

  isEnableStatusOption = true;
  isEnableSaveButton = false;
  reviews :string [] = [];
  reviewStatusOptions = ['NotReviewed', 'InReview', 'Reviewed'];
  selectedReviewOption: any;
  translatedResponse: any;
  userCanEditReviewStatus = false;


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
    this.checkUserPermissions();
    this.getSupervisors();
  }

  getSupervisors() {
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

  private checkUserPermissions() {
    this.topicService.currentUserCanViewTopicReviewStatus(this.topicId)
      .then(
        (response: boolean) => this.userCanEditReviewStatus = response
      ).catch(
      (error: string) => {
        this.toasterService.pop('error', this.getTranslatedString('Error fetching permissions') , error);
      }
    );
  }

  selectReviewStatusOption(option: string){
    this.selectedReviewOption = option;
  }

  editReviewStatus(){
    this.isEnableStatusOption = false;
    this.isEnableSaveButton = true;
  }

  updateReviewStatus(){
    this.topicService.updateReviewerStatus(this.topicId,this.selectedReviewOption)
      .then(
        (response: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Status saved'));
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.getTranslatedString('Error updating status') , error);
      }
    );
    this.isEnableSaveButton = false;
    this.isEnableStatusOption = true;
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
