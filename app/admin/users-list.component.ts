import { Component, OnInit } from '@angular/core';
import { CmsApiService } from '../shared/api/cms-api.service';
import { Observable } from 'rxjs';
import { UserService } from '../shared/user/user.service';
import { User } from '../shared/user/user.model';
import { UsersFilter } from './filter.pipe';
import { UsersSorter } from './sort.pipe';
import { PaginatePipe, PaginationService, PaginationControlsCmp } from 'ng2-pagination';

@Component({
  selector: 'hip-users-list',
  templateUrl: '../app/admin/users-list.component.html',
  providers: [UserService, PaginationService, CmsApiService],
  directives: [PaginationControlsCmp],
  pipes: [UsersFilter, UsersSorter, PaginatePipe]
})

export class UsersListComponent implements OnInit {

  errorMessage: any;
  query: string = '';
  key: string = '';
  direction: number = -1;
  roles = ['Student', 'Supervisor', 'Administrator'];
  options = ['Last Name', 'First Name', 'Email', 'Role'];

  _items: Observable<User[]>;
  _page: number = 1;
  _total: number;

  constructor(private userService: UserService, private cmsApiService: CmsApiService) {
  }

  ngOnInit(): any {
    this.getPage(1);
  }

  getPage(page: number) {
    this._items = this.cmsApiService.getUrl('/api/Users', {})
      .do((res: any) => {
        this._total = res.json().total;
        this._page = page;
      })
      .map((res: any) => res.json().items);
  }

  changeRole(selectedRole: string, user: User) {
    user.role = selectedRole;
    this.userService.updateUser(user)
      .then(data => console.log(data))
      .catch(
        error => this.errorMessage = <any>error
      );
  }

  sort(value: string) {
    this.direction = this.direction * (-1);
    this.key = value;
  }

}
