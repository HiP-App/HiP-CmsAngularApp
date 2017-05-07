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
import { RoutesDetailComponent } from './routes/routes-detail/routes-detail.component';



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
    RoutesDetailComponent
  ],
  entryComponents: [
    RoutesDetailComponent
  ],
  providers: [MobileContentApiService]
})
export class MobileContentModule { }
