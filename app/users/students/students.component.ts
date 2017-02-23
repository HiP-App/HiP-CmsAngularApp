import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';

@Component({
  moduleId: module.id,
  selector: 'hip-students-list',
  templateUrl: 'students.component.html',
  styleUrls: ['students.component.css']
})

export class StudentsComponent implements OnInit {
  errorMessage: any;
  query = '';
  selectedOption = 'Email';
  selectedRole = 'all';
  key = '';
  direction = -1;
  options = [ 'Last Name', 'First Name', 'Email', 'Discipline', 'Degree' ];

  _page: number = 1;
  _total: number;
  students: Promise<User[]>;

  constructor(private userService: UserService) {}

  ngOnInit(): any {
    this.getPage(1);
  }

  getPage(page: number) {
    return this.userService.getAllStudents()
      .then(
        (response: any) => {
          this.students = response;
          this._total = response.total;
          this._page = page;
        }
      ).catch(
        (error: any) => console.error(error)
      );
  }

  sort(value: string) {
    this.direction = this.direction * -1;
    this.key = value;
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
