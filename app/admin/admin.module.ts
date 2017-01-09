import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TranslateModule } from 'ng2-translate';

import { adminRouting } from './admin.routing';
import { AdminComponent } from './admin.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SharedModule } from '../shared/shared.module';
import { UsersFilter } from './pipes/filter.pipe';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersSorter } from './pipes/sort.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    Ng2PaginationModule,
    SharedModule,
    TranslateModule,
    adminRouting
  ],
  declarations: [
    AdminComponent,
    EditUserComponent,
    UsersFilter,
    UsersListComponent,
    UsersSorter
  ]
})
export class AdminModule {}
