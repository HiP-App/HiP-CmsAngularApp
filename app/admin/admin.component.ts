import { Component } from '@angular/core';
import { UsersListComponent } from './users-list.component';
import { CmsApiService } from '../core/api/cms-api.service';

@Component({
  selector: 'hip-admin',
  templateUrl: '../app/admin/admin.component.html',
  directives: [UsersListComponent],
  providers: [CmsApiService]
})

export class AdminComponent {
  constructor() {
  }
}
