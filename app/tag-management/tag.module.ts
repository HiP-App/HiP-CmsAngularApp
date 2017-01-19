import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';

import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AnnotationComponent } from  './annotation/annotation.component';
import { CanvasComponent } from './annotation/canvas/canvas.component';
import { CreateTagDialogComponent } from  './create-tag-dialog/create-tag-dialog.component';
import { DeleteTagDialogComponent } from  './delete-tag-dialog/delete-tag-dialog.component';
import { TagInputComponent } from './all-tags/tag-input/tag-input.component';
import { TagListComponent } from  './all-tags/tag-list/tag-list.component';
import { tagRouting } from  './tag.routing';
import { TagService } from './tag.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    tagRouting,
    TranslateModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    AllTagsComponent,
    AnnotationComponent,
    CanvasComponent,
    CreateTagDialogComponent,
    DeleteTagDialogComponent,
    TagInputComponent,
    TagListComponent
  ],
  entryComponents: [
    CreateTagDialogComponent,
    DeleteTagDialogComponent
  ],
  providers: [TagService]
})
export class TagModule {}
