import { Component,OnInit, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { MdDialog,MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../../../topics/shared/topic.model';
import { TopicService } from '../../../topics/shared/topic.service';
import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature-group',
  templateUrl: 'create-feature-group.component.html'
})
export class CreateFeatureGroupDialogComponent{
  topic: Topic = Topic.emptyTopic();
  emails: {display: string, value: string }[] = [];
  canSend = false;
  errorItems: string[] = [];
  isError = false;
  translatedResponse: any;
  @Output() fieldChange: EventEmitter<string>;


  constructor(public dialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>,
              private topicService: TopicService,
              private toasterService: ToasterService,
              private userService: UserService,
              private translateService: TranslateService) {
    this.fieldChange = new EventEmitter<string>();
  }

  ngOnInit() {
    this.getTopicDetails();
  }

  public validateEmail(item: any): string {
    if (User.validateEmail(item)) {
      return `${item}`;
    }
  }

  public onAdd(item: any) {
    let users: User[] = [];
    this.userService.getUser(item.value).then(
      (response: any) => {
        users = response;
        if (users.length === 0) {
          if (this.errorItems.length === 0) {
            this.canSend = true;
          }
        } else {
          this.isError = true;
          this.errorItems.push(item.value);
          this.canSend = false;
        }
      }
    ).catch(
      (error: any) => console.error(error)
    );
  }

  public onRemove(item: any) {
    let index = this.emails.indexOf(item);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
    if (this.emails.length === 0) {
      this.canSend = false;
    }
    for (let errorItem of this.errorItems) {
      if (item.value === errorItem) {
        let errorIndex = this.errorItems.indexOf(errorItem);
        if (errorIndex >= 0) {
          this.errorItems.splice(errorIndex, 1);
        }
      }
    }
    if (this.errorItems.length === 0 && this.emails.length !== 0) {
      this.canSend = true;
      this.isError = false;
    }
    if (this.errorItems.length === 0) {
      this.isError = false;
    }
  }

  modelChanged(detail: any) {
    this.fieldChange.emit(detail);
  }

  private getTopicDetails() {
    this.topicService.getSupervisorsOfTopic(30)
      .then(
        (response: any) => {
          this.topic.supervisors = <User[]> response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.getTranslatedString('Error fetching Supervisors') , error);
      }
    );
  }

  public sendInvite() {
    this.userService.inviteUsers(this.emails.map((item) => item.value))
      .then(
        () => {
          this.handleResponse('Invitations sent successfully');
          this.emails = [];
        }
      ).catch(
      (error: any) => {
        this.handleError(error);
      }
    );
  }
  private handleResponse(msg: string) {
    this.toasterService.pop('success', 'Success', this.getTranslatedString(msg));
  }

  private handleError(error: any) {
    this.toasterService.pop('error', this.getTranslatedString('Error while sending invitations'));
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}