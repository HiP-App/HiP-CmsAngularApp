import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Roles } from '../roles.model';
import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';

@Component({
  moduleId: module.id,
  templateUrl: 'edit-user.component.html'
})
export class EditUserComponent implements OnInit {
  user: User = User.getEmptyUser();
  roles: string[] = Roles.ROLES;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router) {}

  ngOnInit(): void {
    const userId: number = this.route.snapshot.params['id'];
    this.userService.getUser(userId)
      .then(
        (data: any) => {
          this.user = <User> data;
        }
      ).catch(
        () => {
          this.router.navigate(['/error']);
        }
      );
  }

  changeRole(selectedRole: string): void {
    this.user.role = selectedRole;
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
