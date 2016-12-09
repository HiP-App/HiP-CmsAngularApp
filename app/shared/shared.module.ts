import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';
import { MaterialModule } from '@angular/material';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { FluidHeightDirective } from './textarea/fluid-height.directive';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    TranslateModule
  ],
  exports: [
    AutocompleteComponent,
    FluidHeightDirective,
    UploadPictureComponent
  ],
  declarations: [
    AutocompleteComponent,
    FluidHeightDirective,
    UploadPictureComponent
  ]
})
export class SharedModule {}
