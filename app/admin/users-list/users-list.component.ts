import { Component, OnInit } from '@angular/core';
import { CmsApiService } from '../../core/api/cms-api.service';
import { Observable } from 'rxjs';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';

@Component({
  moduleId: module.id,
  selector: 'hip-users-list',
  templateUrl: 'users-list.component.html',
  styleUrls: ['users-list.component.css']
})
export class UsersListComponent implements OnInit {

  errorMessage: any;
  query: string = '';
  key: string = '';
  direction: number = -1;
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

  sort(value: string) {
    this.direction = this.direction * (-1);
    this.key = value;
  }

}
