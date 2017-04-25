import { Injectable } from '@angular/core';

import { CmsApiService } from '../core/api/cms-api.service';

/**
 * Service for retrieving and managing mobile content on the HiP CMS server.
 */
@Injectable()
export class MobileContentService {

  constructor(private cmsApiService: CmsApiService) {}
}
