import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';

@Component({
  selector: 'hip-invite-users',
  templateUrl: './app/user/invite-users/invite-users.component.html',
  styleUrls: ['./app/user/invite-users/invite-users.component.css']
})
export class InviteUsersComponent implements OnInit {
  
  students: User[] = [];
  emails: String[] = [];
  users: User[] = [];
  canSend = false;

  constructor(private toasterService: ToasterService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getAll()
    .then(
        (response: any) => this.students = response
      )  
    .catch(
        (error: any) => console.log(error)
      )
  }

  modelChanged(users: any) {
    this.canSend = true;
    this.users = users;
    if(this.users.length <= 0) {
      this.canSend = false;
    }
  }

  extractEmails() {
    for(let student of this.students) {
      this.emails.push(student.email)
    }
  }

  sendInvite() {
    this.extractEmails()
    this.userService.inviteUsers(this.emails)
    .then(
        (response:any)=> {
          this.handleResponse('Invitations sent successfully')
          this.emails = [];
        }
      )
    .catch(
        (error:any) => {
          this.handleError(error)
          this.emails = [];
        }
      )
    this.canSend = false;
  }

  private handleResponse(msg: string) {
    this.toasterService.pop('success', 'Success', msg);
  }

  private handleError(error: any) {
    this.toasterService.pop('error', 'Error while sending invitations');
  }
}
