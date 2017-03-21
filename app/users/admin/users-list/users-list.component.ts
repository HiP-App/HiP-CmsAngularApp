import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.model';
import { Roles } from '../roles.model';

@Component({
  moduleId: module.id,
  selector: 'hip-users-list',
  templateUrl: 'users-list.component.html',
  styleUrls: ['users-list.component.css']
})
export class UsersListComponent implements OnInit {
  query = '';
  selectedOption = 'Email';
  roles: string[] = Roles.ROLES;
  selectedRole = 'all roles';
  key = '';
  direction: number = -1;
  options = [ 'Last Name', 'First Name', 'Email' ];

  users: Observable<User[]>;
  _page = 1;
  _total: number;

  constructor(private userService: UserService) {}

  ngOnInit(): any {
    this.roles.push('all roles');
    this.getPage(1);
  }

  getPage(page: number) {
    this.userService.getAll()
      .then(
        (response: any) => {
          this.users = response;
          this._total = response.total;
          this._page = page;
        }
      ).catch(
        (error: any) => console.error(error)
      );
  }

  sort(value: string) {
    this.direction = this.direction * (-1);
    this.key = value;
  }
}
