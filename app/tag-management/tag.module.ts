import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { TranslateModule } from 'ng2-translate';

import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AnnotationComponent } from  './annotation/annotation.component';
import { EditTagComponent } from  './edit-tag/edit-tag.component';
import { DeleteTagComponent } from  './delete-tag/delete-tag.component';
import { NewTagComponent } from  './new-tag/new-tag.component';
import { TagListComponent } from  './all-tags/tag-list/tag-list.component';
import { RemoveSubTagComponent } from  './remove-sub-tags/remove-sub-tags.component';
import { AddSubTagComponent } from  './add-sub-tags/add-sub-tags.component';
import { TagRouting } from  './tag.routing';
import { TagService } from './tag.service';
import { ColorPickerModule } from 'angular2-color-picker';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TagRouting,
    TranslateModule,
    ColorPickerModule
  ],
  declarations: [
    AllTagsComponent,
    AnnotationComponent,
    EditTagComponent,
    DeleteTagComponent,
    NewTagComponent,
    TagListComponent,
    RemoveSubTagComponent,
    AddSubTagComponent
  ],
  providers: [TagService]
})
export class TagModule {
}
