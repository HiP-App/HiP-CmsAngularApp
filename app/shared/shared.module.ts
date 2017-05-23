import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { NgxPaginationModule } from 'ngx-pagination';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule, TranslateService } from 'ng2-translate';

import { AdminGuard } from './guards/admin-guard';
import { AuthApiService } from './api/auth-api.service';
import { AuthGuard } from './guards/auth-guard';
import { CmsApiService } from './api/cms-api.service';
import { HiPMaterialModule } from './hip-material.module';
import { OOApiService } from './api/oo-api.service';
import { PaginationComponent } from './pagination/pagination.component';
import { ScrollService } from './scroll/scroll.service';
import { SupervisorGuard } from './guards/supervisor-guard';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { UserTagInputComponent } from './taginput/user-tag-input.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HiPMaterialModule,
    NgxPaginationModule,
    TagInputModule,
    ToasterModule,
    TranslateModule.forRoot()
  ],
  exports: [
    BrowserModule,
    FormsModule,
    HiPMaterialModule,
    NgxPaginationModule,
    PaginationComponent,
    ToasterModule,
    TranslateModule,
    UploadPictureComponent,
    UserTagInputComponent
  ],
  declarations: [
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
    ScrollService,
    SupervisorGuard,
    ToasterService,
    TranslateService
  ]
})
export class SharedModule {}
