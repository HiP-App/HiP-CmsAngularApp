import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { UserService } from '../core/user/user.service';

@Component({
  selector: 'hip-dashboard',
  templateUrl: './app/invite-users/invite-user.component.html'
})
export class InviteUsersComponent implements OnInit {
  
  //allUserEmails[]: string;
  //users: User[] = User.();


  constructor(private toasterService: ToasterService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getAll()
    .then(
      (response: any) => response
     // this.us
      )
    
  }


}
