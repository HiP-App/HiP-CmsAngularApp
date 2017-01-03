import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { FluidHeightDirective } from './textarea/fluid-height.directive';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { TagInputComponent } from './taginput/taginput.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    TranslateModule,
    TagInputModule,
    Ng2PaginationModule
  ],
  exports: [
    AutocompleteComponent,
    FluidHeightDirective,
    UploadPictureComponent,
    TagInputComponent,
    PaginationComponent
  ],
  declarations: [
    AutocompleteComponent,
    FluidHeightDirective,
    UploadPictureComponent,
    TagInputComponent,
    PaginationComponent
  ]
})
export class SharedModule {}
