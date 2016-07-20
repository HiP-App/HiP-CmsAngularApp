import { Component } from '@angular/core';
import { MdCard } from '@angular2-material/card';
import { MdList, MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { UsersListComponent } from './users-list.component';
import { CmsApiService } from '../shared/api/cms-api.service';

@Component({
    selector: 'hip-admin',
    templateUrl: '../app/admin/admin.component.html',
    directives: [MdCard, MdList, MD_LIST_DIRECTIVES, UsersListComponent],
    providers: [CmsApiService]
})

export class AdminComponent {
    constructor() {}
}