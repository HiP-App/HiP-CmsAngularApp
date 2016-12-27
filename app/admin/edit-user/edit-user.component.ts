import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';
import { Roles } from '../roles.model';

@Component({
  moduleId: module.id,
  templateUrl: 'edit-user.component.html'
})
export class EditUserComponent implements OnInit {
  user: User = User.getEmptyUser();
  roles: string[] = Roles.ROLES;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.userService.getUser(userId).then(
      data => { this.user = <User> data; }
    );
  }

  changeRole(selectedRole: string): void {
    this.user.role = selectedRole;
  }

  updateUser(): void {
    this.userService.updateUser(this.user)
    .then(
      (response: any) => this.handleResponseEdit()
      )
    .catch((error: any) => console.log(error));
  }

  private handleResponseEdit() {
    setTimeout(() => {
      this.router.navigate(['/admin']);
    }, 2000);
  }
}
