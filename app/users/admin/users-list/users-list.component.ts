﻿import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CmsApiService } from '../../../core/api/cms-api.service';
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

  _items: Observable<User[]>;
  _page = 1;
  _total: number;

  constructor(private cmsApiService: CmsApiService) {}

  ngOnInit(): any {
    this.roles.push('all roles');
    this.getPage(1);
  }

  getPage(page: number) {
    this._items = this.cmsApiService.getUrl('/api/Users', {})
      .do(
        (res: any) => {
          this._total = res.json().total;
          this._page = page;
        }
      ).map(
        (res: any) => res.json().items
      );
  }

  sort(value: string) {
    this.direction = this.direction * (-1);
    this.key = value;
  }
}
