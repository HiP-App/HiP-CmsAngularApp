import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule } from 'ng2-dragula';
import { TranslateModule } from 'ng2-translate';

import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AnnotationComponent } from  './annotation/annotation.component';
import { TagFrequencyComponent } from  './annotation/content-analysis/tag-frequency-analysis/tag-frequency-analysis.component';
import { CanvasComponent } from './annotation/canvas/canvas.component';
import { CreateTagDialogComponent } from  './create-tag-dialog/create-tag-dialog.component';
import { DeleteTagDialogComponent } from  './delete-tag-dialog/delete-tag-dialog.component';
import { TagInputComponent } from './all-tags/tag-list/tag-input/tag-input.component';
import { TagListComponent } from  './all-tags/tag-list/tag-list.component';
import { tagRouting } from  './tag.routing';
import { TagService } from './tag.service';
import { SharedModule } from '../shared/shared.module';
import { TagMenuComponent } from './annotation/tag-menu/tag-menu.component';
import { TagMenuItemComponent } from './annotation/tag-menu/tag-menu-item/tag-menu-item.component';
import { TagListItemComponent } from './all-tags/tag-list/tag-list-item/tag-list-item.component';

@NgModule({
  imports: [
    BrowserModule,
    DragulaModule,
    FormsModule,
    tagRouting,
    TranslateModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    AllTagsComponent,
    AnnotationComponent,
    TagFrequencyComponent,
    CanvasComponent,
    CreateTagDialogComponent,
    DeleteTagDialogComponent,
    TagInputComponent,
    TagListComponent,
    TagListItemComponent,
    TagMenuComponent,
    TagMenuItemComponent
  ],
  entryComponents: [
    CreateTagDialogComponent,
    DeleteTagDialogComponent
  ],
  providers: [TagService]
})
export class TagModule {}
