import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TranslateModule } from 'ng2-translate';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { FluidHeightDirective } from './textarea/fluid-height.directive';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule.forRoot(),
    TranslateModule,
    Ng2PaginationModule
  ],
  exports: [
    AutocompleteComponent,
    FluidHeightDirective,
    UploadPictureComponent,
    PaginationComponent
  ],
  declarations: [
    AutocompleteComponent,
    FluidHeightDirective,
    UploadPictureComponent,
    PaginationComponent
  ]
})
export class SharedModule {}
