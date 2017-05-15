import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { LegalNoticeComponent } from './legal-notice/legal-notice.component';

const footerRoutes: Routes = [
  {
    path: 'legal-notice',
    component: LegalNoticeComponent
  }
];

export const footerRouting: ModuleWithProviders = RouterModule.forChild(footerRoutes);
