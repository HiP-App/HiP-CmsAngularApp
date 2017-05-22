import { NgModule } from '@angular/core';
import { MdGridListModule } from '@angular/material';

import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { DeleteExhibitDialogComponent } from './exhibits/delete-exhibit-dialog/delete-exhibit-dialog.component';
import { DeleteMediumDialogComponent } from './media/delete-medium-dialog/delete-medium-dialog.component';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { EditMediumDialogComponent } from './media/edit-medium-dialog/edit-medium-dialog.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { mobileContentRouting } from './mobile-content.routing';
import { MobileContentApiService } from './mobile-content-api.service';
import { RoutesComponent } from './routes/routes.component';
import { SharedModule } from '../shared/shared.module';
import { TagsComponent } from './tags/tags.component';
import { UploadMediumDialogComponent } from './media/upload-medium-dialog/upload-medium-dialog.component';

@NgModule({
  imports: [
    MdGridListModule,
    mobileContentRouting,
    SharedModule
  ],
  declarations: [
    CreateExhibitDialogComponent,
    DeleteExhibitDialogComponent,
    DeleteMediumDialogComponent,
    EditExhibitComponent,
    EditMediumDialogComponent,
    ExhibitsComponent,
    MediaComponent,
    RoutesComponent,
    TagsComponent,
    UploadMediumDialogComponent
  ],
  entryComponents: [
    CreateExhibitDialogComponent,
    DeleteExhibitDialogComponent,
    DeleteMediumDialogComponent,
    EditMediumDialogComponent,
    UploadMediumDialogComponent
  ],
  providers: [
    MobileContentApiService
  ]
})
export class MobileContentModule { }
