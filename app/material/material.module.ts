import { NgModule } from '@angular/core';
import { MdRippleModule, MdCoreModule } from '@angular2-material/core';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdSidenavModule } from '@angular2-material/sidenav';
import { MdProgressCircleModule } from '@angular2-material/progress-circle';
import { MdButtonModule } from '@angular2-material/button';
import { MdListModule } from '@angular2-material/list';
import { MdCardModule } from '@angular2-material/card';
import { MdInputModule } from '@angular2-material/input';
import { MdIconModule } from '@angular2-material/icon';
import { MdRadioModule } from '@angular2-material/radio';
@NgModule({
  imports: [
    MdButtonModule,
    MdCardModule,
    MdIconModule,
    MdInputModule,
    MdRadioModule,
    MdListModule,
    MdCoreModule,
    MdToolbarModule,
    MdSidenavModule,
    MdRippleModule,
    MdProgressCircleModule
  ],
  exports: [
    MdButtonModule,
    MdCardModule,
    MdIconModule,
    MdInputModule,
    MdRadioModule,
    MdListModule,
    MdCoreModule,
    MdToolbarModule,
    MdSidenavModule,
    MdRippleModule,
    MdProgressCircleModule
  ]
})
export class MaterialModule {}
