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
  
  students: any;
  emails: String[] = [];
  users: User[] = [];
  canSend = false;
  email: string;

  constructor(private toasterService: ToasterService,
              private userService: UserService) {
    this.emails = []
  }

  ngOnInit() {
    this.userService.getAll()
    .then(
        (response: any) => {
        console.log(response)
        this.students = response
      }
      )  
    .catch(
        (error: any) => console.log(error)
      )
  }

  public validateEmail(item: any): string {
    if(item.includes("@") && item.includes("."))
      return `${item}`;
  }

  public onAdd(item: any) {
    console.log(this.students)
    for(let student of this.students) {

      if("neelakshinaphade@gmail.com" === item) {
        this.toasterService.pop(student.email+" already exist")
      }
    }
    this.canSend = true;
    this.emails.push(item);
  }

  public onRemove(item: any) {
    let index = this.emails.indexOf(item)
    this.emails.splice(index, 1);
  }

  public sendInvite(emailList: string) {
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

  private handleError(msg: any) {
    this.toasterService.pop('error', 'Error while sending invitations');
  }
}
