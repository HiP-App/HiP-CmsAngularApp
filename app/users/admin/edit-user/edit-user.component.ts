import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Roles } from '../roles.model';
import { User } from '../../user.model';
import { UserService } from '../../user.service';

@Component({
  moduleId: module.id,
  templateUrl: 'edit-user.component.html'
})
export class EditUserComponent implements OnInit {
  user: User = User.getEmptyUser();
  showStudentDetails = false;
  roles: string[] = Roles.ROLES;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {}

  ngOnInit(): void {
    const userId = decodeURI(this.route.snapshot.params['id']);
    this.userService.getUser(userId)
      .then(
        (data: User) => {
          this.user = data;
          this.showStudentDetails = (this.user.roles === 'Student');
        }
      ).catch(
        () => {
          this.router.navigate(['/error']);
        }
      );
  }

  updateUser(): void {
    this.userService.updateUser(this.user)
      .then(
        (response: any) => this.handleResponseEdit()
      ).catch(
        (error: any) => console.error(error)
      );
  }

  private handleResponseEdit() {
    setTimeout(
      () => {
        this.router.navigate(['/users']);
      }, 2000);
  }
}
