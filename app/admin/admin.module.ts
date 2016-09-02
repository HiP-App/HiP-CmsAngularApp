import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MdCardModule } from '@angular2-material/card';
import { PaginatePipe, PaginationService } from 'ng2-pagination';

import { AdminComponent } from './admin.component';
import { UsersFilter } from './pipes/filter.pipe';
import { UsersSorter } from './pipes/sort.pipe';
import { adminRouting } from './admin.routing';
import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  imports: [
    BrowserModule,
    adminRouting,
    FormsModule,
    MdCardModule
  ],
  declarations: [
    AdminComponent,
    UsersListComponent,
    UsersFilter,
    UsersSorter,
    PaginatePipe
  ],
  providers: [
    PaginationService
  ]
})
export class AdminModule {
}
