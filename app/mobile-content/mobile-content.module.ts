import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';
import { NgxPaginationModule } from 'ngx-pagination';
import { mobileContentRouting } from './mobile-content.routing';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
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
    BrowserModule,
    FormsModule,
    TranslateModule,
    MaterialModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ExhibitsComponent,
    MediaComponent,
    RoutesComponent,
    TagsComponent,
    EditRouteComponent,
    CreateRouteComponent
  ],
  entryComponents: [
    EditRouteComponent,
    CreateRouteComponent
  ],
  providers: [MobileContentApiService, RouteService]
})
export class MobileContentModule { }
