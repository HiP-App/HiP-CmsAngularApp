import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { ErrorPageComponent } from './error-page/error-page.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';

const pagesRoutes: Routes = [
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: 'legal-notice',
    component: LegalNoticeComponent
  }
];

export const pagesRouting: ModuleWithProviders = RouterModule.forChild(pagesRoutes);
