import { NgModule } from '@angular/core';
import { MdGridListModule } from '@angular/material';

import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { CreateRouteDialogComponent } from './routes/create-route-dialog/create-route-dialog.component';
import { DeleteExhibitDialogComponent } from './exhibits/delete-exhibit-dialog/delete-exhibit-dialog.component';
import { DeleteMediumDialogComponent } from './media/delete-medium-dialog/delete-medium-dialog.component';
import { DeleteRouteDialogComponent } from './routes/delete-route-dialog/delete-route-dialog.component';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { EditMediumDialogComponent } from './media/edit-medium-dialog/edit-medium-dialog.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { MediaGalleryComponent } from './media/media-gallery/media-gallery.component';
import { mobileContentRouting } from './mobile-content.routing';
import { MobileContentApiService } from './shared/mobile-content-api.service';
import { RoutesComponent } from './routes/routes.component';
import { SelectMediumDialogComponent } from './media/select-medium-dialog/select-medium-dialog.component';
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
    CreateRouteDialogComponent,
    DeleteExhibitDialogComponent,
    DeleteMediumDialogComponent,
    DeleteRouteDialogComponent,
    EditExhibitComponent,
    EditMediumDialogComponent,
    EditRouteComponent,
    ExhibitsComponent,
    MediaComponent,
    MediaGalleryComponent,
    RoutesComponent,
    SelectMediumDialogComponent,
    TagsComponent,
    UploadMediumDialogComponent
  ],
  entryComponents: [
    CreateRouteDialogComponent,
    CreateExhibitDialogComponent,
    DeleteExhibitDialogComponent,
    DeleteMediumDialogComponent,
    DeleteRouteDialogComponent,
    EditMediumDialogComponent,
    SelectMediumDialogComponent,
    UploadMediumDialogComponent
  ],
  providers: [
    MobileContentApiService
  ]
})
export class MobileContentModule {}
