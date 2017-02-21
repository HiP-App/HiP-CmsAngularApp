import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CmsApiService } from '../../core/api/cms-api.service';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';
import { Roles } from '../admin/roles.model';


@Component({
  moduleId: module.id,
  selector: 'hip-students-list',
  templateUrl: 'students.component.html',
  styleUrls: ['students.component.css']
})
export class StudentsComponent implements OnInit {
  errorMessage: any;
  query: string = '';
  selectedOption: string = 'Email';
  roles: string[] = Roles.ROLES;
  selectedRole: string = 'all';
  key: string = '';
  direction: number = -1;
  options = [ 'Last Name', 'First Name', 'Email' ];

  _page: number = 1;
  _total: number;
  students: Promise<User[]>

  constructor(private cmsApiService: CmsApiService,
              private userService: UserService) {}

  ngOnInit(): any {
    this.getPage(1);
  }

  getPage(page: number) {
    return this.cmsApiService.getUrl('/api/Users?role=Student',{})
      .map(
        (response: any) => response.json().items
      ).subscribe(
        (data: any) => {
          this.students = data;
          this._page = page;
        }
      );
  }
 
  sort(value: string) {
    this.direction = this.direction * (-1);
    this.key = value;
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  selectRole(role: string) {
    this.selectedRole = role;
  }
}
