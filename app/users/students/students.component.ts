import { Component, OnInit } from '@angular/core';

import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-students-list',
  templateUrl: 'students.component.html',
  styleUrls: ['students.component.css']
})

export class StudentsComponent implements OnInit {
  query = '';
  selectedOption = 'Email';
  key = '';
  direction = -1;
  options = [ 'Last Name', 'First Name', 'Email', 'Discipline', 'Degree' ];

  currentPage = 1;
  studentsPerPage = 10;
  totalStudents: number;
  students: User[];

  private studentCache = new Map<number, User[]>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getPage(1);
  }

  getPage(page: number) {
    if (this.studentCache.has(page)) {
      this.students = this.studentCache.get(page);
      this.currentPage = page;
    } else {
      this.userService.getAllStudents(page, this.studentsPerPage)
        .then(
          response => {
            this.students = response.items;
            this.totalStudents = response.metadata.totalItems;
            this.currentPage = page;

            this.studentCache.set(this.currentPage, this.students);
          }
        ).catch(
          (error: any) => console.error(error)
        );
    }
  }

  sort(value: string) {
    this.direction = this.direction * -1;
    this.key = value;
  }
}
