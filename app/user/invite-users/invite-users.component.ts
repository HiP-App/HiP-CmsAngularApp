import { Component } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';

@Component({
  moduleId: module.id,
  selector: 'hip-invite-users',
  templateUrl: 'invite-users.component.html',
  styleUrls: ['invite-users.component.css']
})
export class InviteUsersComponent{
  
  emails: String[] = [];
  users: User[] = [];
  canSend = false;

  constructor(private toasterService: ToasterService,
              private userService: UserService) {
  }

  public validateEmail(item: any): string {
    if(item.includes("@") && item.includes(".")) {
      return `${item}`;
    }
  }

  public onAdd(item: any) {
    this.userService.getUserByEmail(item)
    .then(
        (response: any) => {
          this.users = response;
          if(this.users.length === 0) {
            this.canSend = true;
            this.emails.push(item);
          }
          else {
            this.toasterService.pop("error",item+ " already exist");
          }
        }
      )  
    .catch(
        (error: any) => console.log(error)
      )    
  }

  public onRemove(item: any) {
    let index = this.emails.indexOf(item);
    this.emails.splice(index, 1);
  }

  public sendInvite(emailList: string) {
    this.userService.inviteUsers(this.emails)
    .then(
        (response:any)=> {
          this.handleResponse("Invitations sent successfully");
          this.emails = [];
        }
      )
    .catch(
        (error:any) => {
          this.handleError(error);
          this.emails = [];
        }
      )
    this.canSend = false;
  }

  private handleResponse(msg: string) {
    this.toasterService.pop("success", "Success", msg);
  }

  private handleError(error: any) {
    this.toasterService.pop("error", "Error while sending invitations"+ error);
  }
}
