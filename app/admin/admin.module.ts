import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MdCardModule } from '@angular2-material/card';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TranslateModule } from 'ng2-translate';

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
    MdCardModule,
    Ng2PaginationModule,
    TranslateModule
  ],
  declarations: [
    AdminComponent,
    UsersListComponent,
    UsersFilter,
    UsersSorter
  ],
  providers: [
  ]
})
export class AdminModule {
}
