import { NgModule } from '@angular/core';
import { MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdSelectModule,
  MdSidenavModule,
  MdChipsModule,
  MdTabsModule,
  MdToolbarModule,
  OverlayModule
} from '@angular/material';

/**
 * Own MaterialModule, importing only the Material components needed.
 */
const MATERIAL_MODULES = [
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdChipsModule,
  MdMenuModule,
  MdProgressBarModule,
  MdSelectModule,
  MdSidenavModule,
  MdTabsModule,
  MdToolbarModule,
  OverlayModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class HiPMaterialModule {}
