import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { NgxPaginationModule } from 'ngx-pagination';

import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    TranslateModule
  ],
  exports: [
    PaginationComponent,
  ],
  declarations: [
    PaginationComponent
  ],
})
export class SharedPaginationModule {}
