import { NgModule } from '@angular/core';

import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { CreateRouteDialogComponent } from './routes/create-route-dialog/create-route-dialog.component';
import { DeleteExhibitDialogComponent } from './exhibits/delete-exhibit-dialog/delete-exhibit-dialog.component';
import { DeleteRouteDialogComponent } from './routes/delete-route-dialog/delete-route-dialog.component';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { mobileContentRouting } from './mobile-content.routing';
import { MobileContentApiService } from './mobile-content-api.service';
import { RoutesComponent } from './routes/routes.component';
import { SharedModule } from '../shared/shared.module';
import { TagsComponent } from './tags/tags.component';

@NgModule({
  imports: [
    mobileContentRouting,
    SharedModule
  ],
  declarations: [
    CreateExhibitDialogComponent,
    CreateRouteDialogComponent,
    DeleteExhibitDialogComponent,
    DeleteRouteDialogComponent,
    EditExhibitComponent,
    EditRouteComponent,
    ExhibitsComponent,
    MediaComponent,
    RoutesComponent,
    TagsComponent
  ],
  entryComponents: [
    CreateRouteDialogComponent,
    CreateExhibitDialogComponent,
    DeleteExhibitDialogComponent,
    DeleteRouteDialogComponent
  ],
  providers: [
    MobileContentApiService
  ]
})
export class MobileContentModule {}
