import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';
import { MaterialModule } from '@angular/material';
import { TagInputModule } from 'ng2-tag-input';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { FluidHeightDirective } from './textarea/fluid-height.directive';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { TagInputComponent } from './taginput/taginput.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    TranslateModule,
    TagInputModule
  ],
  exports: [
    AutocompleteComponent,
    FluidHeightDirective,
    UploadPictureComponent,
    TagInputComponent
  ],
  declarations: [
    AutocompleteComponent,
    FluidHeightDirective,
    UploadPictureComponent,
    TagInputComponent
  ]
})
export class SharedModule {}
