import { NgModule } from '@angular/core';
import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { DeleteExhibitDialogComponent } from './exhibits/delete-exhibit-dialog/delete-exhibit-dialog.component';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { mobileContentRouting } from './mobile-content.routing';
import { MobileContentApiService } from './mobile-content-api.service';
import { RoutesComponent } from './routes/routes.component';
import { SharedModule } from '../shared/shared.module';
import { TagsComponent } from './tags/tags.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { CreateRouteComponent } from './routes/create-route/create-route.component';
import { RouteService } from './routes/routes.service';




@NgModule({
  imports: [
    mobileContentRouting,
    SharedModule
  ],
  declarations: [
    CreateExhibitDialogComponent,
    DeleteExhibitDialogComponent,
    EditExhibitComponent,
    ExhibitsComponent,
    MediaComponent,
    RoutesComponent,
    TagsComponent,
    EditRouteComponent,
    CreateRouteComponent
  ],
  entryComponents: [
    EditRouteComponent,
    CreateRouteComponent,
    CreateExhibitDialogComponent,
    DeleteExhibitDialogComponent
  ],
  providers: [MobileContentApiService, RouteService]
})
export class MobileContentModule { }
