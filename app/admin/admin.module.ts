import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TranslateModule } from 'ng2-translate';

import { AdminComponent } from './admin.component';
import { UsersFilter } from './pipes/filter.pipe';
import { UsersSorter } from './pipes/sort.pipe';
import { adminRouting } from './admin.routing';
import { UsersListComponent } from './users-list/users-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SharedModule } from '../../app/shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    adminRouting,
    FormsModule,
    MaterialModule,
    Ng2PaginationModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [
    AdminComponent,
    EditUserComponent,
    UsersListComponent,
    UsersFilter,
    UsersSorter
  ],
  providers: [
  ]
})
export class AdminModule {
}
