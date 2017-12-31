import { Component, OnInit } from '@angular/core';

import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-students-list',
  templateUrl: 'students.component.html',
  styleUrls: ['students.component.css']
})

export class StudentsComponent implements OnInit {
  query = '';
  key = '';
  direction = -1;

  currentPage = 1;
  studentsPerPage = 10;
  totalStudents: number;
  students: User[];
  showingSearchResults = false;

  private studentCache = new Map<number, User[]>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getPage(1);
  }

  getPage(page: number, query?: string) {
    if (this.studentCache.has(page)) {
      this.students = this.studentCache.get(page);
      this.currentPage = page;
    } else {
      this.userService.queryAll(page, this.studentsPerPage, 'Student', query)
        .then(
          response => {
            console.log('student', response);
            this.students = response.items;
            this.totalStudents = response.total;
            this.currentPage = page;

            this.studentCache.set(this.currentPage, this.students);
          }
        ).catch(
          (error: any) => console.error(error)
        );
    }
  }

  findStudents() {
    if (this.query.trim().length > 0) {
      this.showingSearchResults = true;
      this.students = undefined;
      this.studentCache.clear();
      this.getPage(1, this.query.trim());
    }
  }

  resetSearch() {
    this.showingSearchResults = false;
    this.query = '';
    this.students = undefined;
    this.studentCache.clear();
    this.getPage(1);
  }

  sort(value: string) {
    this.direction = this.direction * -1;
    this.key = value;
  }
}
