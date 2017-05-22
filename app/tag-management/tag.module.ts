import { NgModule } from '@angular/core';
import { DragulaModule } from 'ng2-dragula';

import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AnnotationComponent } from  './annotation/annotation.component';
import { CanvasComponent } from './annotation/canvas/canvas.component';
import { CreateTagDialogComponent } from  './create-tag-dialog/create-tag-dialog.component';
import { DeleteTagDialogComponent } from  './delete-tag-dialog/delete-tag-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { TagFrequencyComponent } from  './annotation/content-analysis/tag-frequency-analysis/tag-frequency-analysis.component';
import { TagInputComponent } from './all-tags/tag-list/tag-input/tag-input.component';
import { TagListComponent } from  './all-tags/tag-list/tag-list.component';
import { TagListItemComponent } from './all-tags/tag-list/tag-list-item/tag-list-item.component';
import { TagMenuComponent } from './annotation/tag-menu/tag-menu.component';
import { TagMenuItemComponent } from './annotation/tag-menu/tag-menu-item/tag-menu-item.component';
import { tagRouting } from  './tag.routing';
import { TagService } from './tag.service';
import { TagsFilterPipe } from './annotation/pipes/tags-filter.pipe';
import { TagsSorterPipe } from './annotation/pipes/tags-sorter.pipe';

@NgModule({
  imports: [
    DragulaModule,
    tagRouting,
    SharedModule
  ],
  declarations: [
    AllTagsComponent,
    AnnotationComponent,
    CanvasComponent,
    CreateTagDialogComponent,
    DeleteTagDialogComponent,
    TagFrequencyComponent,
    TagInputComponent,
    TagListComponent,
    TagListItemComponent,
    TagMenuComponent,
    TagMenuItemComponent,
    TagsFilterPipe,
    TagsSorterPipe
  ],
  entryComponents: [
    CreateTagDialogComponent,
    DeleteTagDialogComponent
  ],
  providers: [
    TagService
  ]
})
export class TagModule {}
