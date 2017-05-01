import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { sharedRouting } from './shared.routing';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ScrollService } from '../shared/scroll/scroll.service';
import { UserTagInputComponent } from './taginput/user-tag-input.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule.forRoot(),
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
    ScrollService
  ]
})
export class SharedModule {}
