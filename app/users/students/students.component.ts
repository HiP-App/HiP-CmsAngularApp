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
  query: string = '';
  selectedOption: string = 'Email';
  selectedRole: string = 'all';
  key: string = '';
  direction: number = -1;
  options = [ 'Last Name', 'First Name', 'Email' ];

  _page: number = 1;
  _total: number;
  students: Promise<User[]>

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
          console.log(this.students[0])
        }
      ).catch(
        (error: any) => console.log(error)
      )
  }
 
  sort(value: string) {
    this.direction = this.direction * (-1);
    this.key = value;
  }
}
