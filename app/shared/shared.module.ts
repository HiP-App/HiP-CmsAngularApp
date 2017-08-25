import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdCardModule, MdIconModule } from '@angular/material';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { NgxPaginationModule } from 'ngx-pagination';

import { AdminGuard } from './guards/admin-guard';
import { AuthApiService } from './api/auth-api.service';
import { AuthGuard } from './guards/auth-guard';
import { CmsApiService } from './api/cms-api.service';
import { OOApiService } from './api/oo-api.service';
import { PaginationComponent } from './pagination/pagination.component';
import { ScrollService } from './scroll/scroll.service';
import { SupervisorGuard } from './guards/supervisor-guard';
import { UserTagInputComponent } from './taginput/user-tag-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    MdCardModule,
    MdIconModule,
    TagInputModule,
    TranslateModule
  ],
  exports: [
    PaginationComponent,
    UserTagInputComponent,
    TranslateModule
  ],
  declarations: [
    PaginationComponent,
    UserTagInputComponent
  ],
  providers: [
    AdminGuard,
    AuthApiService,
    AuthGuard,
    CmsApiService,
    OOApiService,
    ScrollService,
    SupervisorGuard,
    TranslateService
  ]
})
export class SharedModule {}
