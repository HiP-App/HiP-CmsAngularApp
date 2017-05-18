import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { NgxPaginationModule } from 'ngx-pagination';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule, TranslateService } from 'ng2-translate';

import { sharedRouting } from './shared.routing';
import { AdminGuard } from './guards/admin-guard';
import { AuthApiService } from './api/auth-api.service';
import { AuthGuard } from './guards/auth-guard';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { CmsApiService } from './api/cms-api.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HiPMaterialModule } from './hip-material.module';
import { OOApiService } from './api/oo-api.service';
import { PaginationComponent } from './pagination/pagination.component';
import { ScrollService } from './scroll/scroll.service';
import { SupervisorGuard } from './guards/supervisor-guard';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { UserTagInputComponent } from './taginput/user-tag-input.component';
import {DataStoreApiService} from './api/datastore-api.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HiPMaterialModule,
    HttpModule,
    NgxPaginationModule,
    RouterModule,
    TagInputModule,
    ToasterModule,
    TranslateModule.forRoot(),
    sharedRouting
  ],
  exports: [
    AutocompleteComponent,
    ErrorPageComponent,
    HiPMaterialModule,
    NgxPaginationModule,
    PaginationComponent,
    ToasterModule,
    TranslateModule,
    UploadPictureComponent,
    UserTagInputComponent
  ],
  declarations: [
    AutocompleteComponent,
    ErrorPageComponent,
    PaginationComponent,
    UploadPictureComponent,
    UserTagInputComponent
  ],
  providers: [
    AdminGuard,
    AuthApiService,
    AuthGuard,
    CmsApiService,
    OOApiService,
    DataStoreApiService,
    ScrollService,
    SupervisorGuard,
    ToasterService,
    TranslateService
  ]
})
export class SharedModule {}
