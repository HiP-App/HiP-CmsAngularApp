import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../user.model';
import { UserService } from '../../user.service';
import { checkNoChangesNode } from '@angular/core/src/view/view';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-student-details',
  styleUrls: ['edit-student-details.component.css'],
  templateUrl: 'edit-student-details.component.html'
})
export class EditStudentDetailsComponent implements OnInit {
  @Input() user: User;
  @Input() isCurrent = false;
  disciplines: string[] = [];
  userId: string;
  showStudentDetails = false;


  constructor(private toasterService: ToasterService,
    private translateService: TranslateService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    for (let role of this.user.roles) {
      if (role === 'Student') {
        this.showStudentDetails = true;
      }
    }
    this.userService.getDisciplines()
      .then(
        data => {
          this.disciplines = data;
        }
      ).catch(
        error => console.error(error)
      );
  }

  updateStudentDetails() {
    this.userService.updateStudentDetails(this.user, this.isCurrent)
      .then(
        (response: string) => {
          this.toasterService.pop('success', this.getTranslatedString('Information successfully updated'));
        }
      ).catch(
        error => this.toasterService.pop('error', error)
      );
  }

  deleteStudentDetails() {
    this.userService.deleteStudentDetails(this.userId)
      .then(
        (response: string) => {
          this.handleResponseEdit();
        }
      ).catch(
        error => this.toasterService.pop('error', error)
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

  private handleResponseEdit() {
    setTimeout(
      () => {
        this.router.navigate(['/dashboard']);
      }, 2000);
  }
}
