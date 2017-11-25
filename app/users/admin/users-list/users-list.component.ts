import { Component, OnInit } from '@angular/core';

import { UserService } from '../../user.service';
import { User } from '../../user.model';
import { Roles } from '../roles.model';

@Component({
  moduleId: module.id,
  selector: 'hip-users-list',
  templateUrl: 'users-list.component.html',
  styleUrls: ['users-list.component.css']
})
export class UsersListComponent implements OnInit {
  query = '';
  roles = Roles.ROLES.concat('all roles');
  selectedRole = 'all roles';
  key = '';
  direction = -1;

  users: User[];
  currentPage = 1;
  usersPerPage = 10;
  totalUsers: number;
  showingSearchResults = false;

  private userCache = new Map<number, User[]>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getPage(1);
  }

  getPage(page: number) {
    if (this.userCache.has(page)) {
      this.users = this.userCache.get(page);
      this.currentPage = page;
    } else {
      let role = Roles.ROLES.includes(this.selectedRole) ? this.selectedRole : undefined;
      this.userService.queryAll(page, this.usersPerPage, role, this.query.trim())
        .then(
          response => {
            this.users = response.items;
            this.totalUsers = response.total;
            this.currentPage = page;

            this.userCache.set(this.currentPage, this.users);
          }
        ).catch(
          (error: any) => console.error(error)
        );
    }
  }

  findUsers() {
    if (this.query.trim().length > 0) {
      this.showingSearchResults = true;
      this.reloadList();
    }
  }

  reloadList() {
    this.users = undefined;
    this.userCache.clear();
    this.getPage(1);
  }

  resetSearch() {
    this.showingSearchResults = false;
    this.query = '';
    this.reloadList();
  }

  sort(value: string) {
    this.direction = this.direction * (-1);
    this.key = value;
  }
}
