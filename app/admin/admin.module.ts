import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MdCardModule } from '@angular2-material/card';
import { MdGridListModule } from '@angular2-material/grid-list';
import { MdInputModule } from '@angular2-material/input';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TranslateModule } from 'ng2-translate';

import { AdminComponent } from './admin.component';
import { UsersFilter } from './pipes/filter.pipe';
import { UsersSorter } from './pipes/sort.pipe';
import { adminRouting } from './admin.routing';
import { UsersListComponent } from './users-list/users-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@NgModule({
  imports: [
    BrowserModule,
    adminRouting,
    FormsModule,
    MdCardModule,
    MdGridListModule,
    MdInputModule,
    Ng2PaginationModule,
    TranslateModule
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
