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
  errorItem: string = "";
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
          this.canSend = true;
          this.emails.push(item);
        } else {
          this.errorItem = item;
          this.isError = true
          this.canSend = false;  
        }
      }
    ).catch(
      (error: any) => console.log(error)
    )    
  }

  public onRemove(item: any) {
    let index = this.emails.indexOf(item);
    this.emails.splice(index, 1);
    if(item === this.errorItem)
    {
      this.isError = false;
      this.errorItem = ""
      this.canSend = true;
    }
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
