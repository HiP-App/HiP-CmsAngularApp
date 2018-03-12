import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Roles } from '../roles.model';
import { User } from '../../user.model';
import { UserService } from '../../user.service';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  templateUrl: 'edit-user.component.html'
})
export class EditUserComponent implements OnInit {
  user: User = User.getEmptyUser();
  showStudentDetails = false;
  roles: string[] = Roles.ROLES;
  updatedRole: string[] = [];
  selectedRole: string[];
  newRole = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toasterService: ToasterService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    const userId = decodeURI(this.route.snapshot.params['id']);
    this.userService.getUser(userId)
      .then(
        (data: User) => {
          this.user = data;
          for (let role of this.user.roles) {
            if (role === 'Student') {
              this.showStudentDetails = true;
            }
          }
        }
      ).catch(
        () => {
          this.router.navigate(['/error']);
        }
      );
  }

  selectRole(role) {
    if (this.updatedRole.indexOf(role) === -1) {
      this.updatedRole.push(role);
      this.newRole = true;
    }
  }

  updateUser(): void {
    if (this.newRole === true) {
      this.userService.updateRoles(this.updatedRole, this.user)
        .then(
          (response: any) => this.toasterService.pop('success', this.getTranslatedString('Information successfully updated'))
        ).catch(
          // tslint:disable-next-line:no-shadowed-variable
          (error: any) => console.error(error)
        );
    }
    if (this.newRole === false) {
      this.userService.updateUser(this.user)
        .then(
          (response: any) => this.toasterService.pop('success', this.getTranslatedString('Information successfully updated'))
        )
        .catch(
          // tslint:disable-next-line:no-shadowed-variable
          (error: any) => console.error(error)
        );
    }
  }

  getTranslatedString(data: any) {
    let translatedResponse = '';
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }
}
