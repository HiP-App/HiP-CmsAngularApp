import { Component } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';

@Component({
  moduleId: module.id,
  selector: 'hip-invite-users',
  templateUrl: 'invite-users.component.html',
  styleUrls: ['invite-users.component.css']
})
export class InviteUsersComponent {
  
  emails: String[] = [];
  users: User[] = [];
  canSend = false;
  errorItems: string[] = [];
  isError = false;
  translatedResponse: any;

  constructor(private toasterService: ToasterService,
              private userService: UserService,
              private translateService: TranslateService) {
  }

  public validateEmail(item: any): string {
    if(item.includes("@") && item.includes(".")) {
      return `${item}`;
    }
  }

  public onAdd(item: any) {
    this.userService.getUserByEmail(item).then(
      (response: any) => {
        this.users = response;
        if(this.users.length === 0) {
          if(this.errorItems.length === 0)
            this.canSend = true;
          this.emails.push(item);
        } else {
          this.isError = true;
          this.errorItems.push(item);
          this.canSend = false; 
        }
      }
    ).catch(
      (error: any) => console.log(error)
    )    
  }

  public onRemove(item: any) {
    let index = this.emails.indexOf(item);
    if(index >= 0)
      this.emails.splice(index, 1);
    if(this.emails.length === 0)
      this.canSend = false;
    for(let errorItem of this.errorItems) {
      if(item === errorItem) {
        let errorIndex = this.errorItems.indexOf(errorItem);
        if(errorIndex >= 0)
          this.errorItems.splice(errorIndex, 1);
      }
    }
    if(this.errorItems.length === 0 && this.emails.length !== 0){
      this.canSend = true;
      this.isError = false;
    }
    if(this.errorItems.length === 0)
      this.isError = false;
  }

  public sendInvite(emailList: string) {
    this.userService.inviteUsers(this.emails).then(
      (response:any)=> {
        this.handleResponse('Invitations sent successfully');
        this.emails = [];
      }
    ).catch(
      (error:any) => {
        this.handleError(error);
        this.emails = [];
      }
    )
    this.canSend = false;
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
    )
    return this.translatedResponse;
  }
}
