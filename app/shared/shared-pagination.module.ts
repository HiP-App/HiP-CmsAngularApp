import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    NgxPaginationModule,
    PaginationComponent,
  ],
  declarations: [
    PaginationComponent
  ],
})
export class SharedPaginationModule {}
