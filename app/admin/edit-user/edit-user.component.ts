import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';
import { Roles } from '../roles.model';

@Component({
  styleUrls: [ '../app/admin/edit-user/edit-user.component.css' ],
  templateUrl: '../app/admin/edit-user/edit-user.component.html'
})
export class EditUserComponent implements OnInit {
  user: User = User.getEmptyUser();
  roles = [ Roles.ADMIN, Roles.STUDENT, Roles.SUPERVISOR];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.userService.getUser(userId).then(
      data => { this.user = <User> data; }
    );
  }

  changeRole(selectedRole: string): void {
    this.user.role = selectedRole;
  }

  update(user: User): void {
    this.userService.updateUser(this.user)
      .catch(error => console.error(error));
  }
}
