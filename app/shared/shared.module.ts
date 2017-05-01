import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { sharedRouting } from './shared.routing';
import { AdminGuard } from './guards/admin-guard';
import { AuthApiService } from './api/auth-api.service';
import { AuthGuard } from './guards/auth-guard';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { CmsApiService } from './api/cms-api.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { OOApiService } from './api/oo-api.service';
import { PaginationComponent } from './pagination/pagination.component';
import { ScrollService } from './scroll/scroll.service';
import { SupervisorGuard } from './guards/supervisor-guard';
import { UserTagInputComponent } from './taginput/user-tag-input.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    TagInputModule,
    TranslateModule,
    NgxPaginationModule,
    sharedRouting
  ],
  exports: [
    AutocompleteComponent,
    ErrorPageComponent,
    UploadPictureComponent,
    UserTagInputComponent,
    PaginationComponent
  ],
  declarations: [
    AutocompleteComponent,
    ErrorPageComponent,
    UploadPictureComponent,
    UserTagInputComponent,
    PaginationComponent
  ],
  providers: [
    AdminGuard,
    AuthApiService,
    AuthGuard,
    CmsApiService,
    OOApiService,
    ScrollService,
    SupervisorGuard
  ]
})
export class SharedModule {}
