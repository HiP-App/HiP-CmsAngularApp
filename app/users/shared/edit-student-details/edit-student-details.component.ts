import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-student-details',
  templateUrl: 'edit-student-details.component.html'
})
export class EditStudentDetailsComponent implements OnInit {
  @Input() user: User;
  @Input() isCurrent = false;
  disciplines: string[] = [];

  constructor(private toasterService: ToasterService,
              private translateService: TranslateService,
              private userService: UserService) {}

  ngOnInit() {
    this.userService.getDisciplines()
      .then(
        data => this.disciplines = data
      ).catch(
        error => console.error(error)
      );
  }

  updateStudentDetails() {
    this.userService.updateStudentDetails(this.user, this.isCurrent)
      .then(
        (response: string) => {
          this.toasterService.pop('success', 'Success', this.getTranslatedString(response));
        }
      ).catch(
        error => this.toasterService.pop('error', 'Error', error.error)
      );
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
