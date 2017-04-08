import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { CmsApiService } from '../core/api/cms-api.service';

/**
 * Service for the notifications.
 */
@Injectable()
export class FeatureToggleService {

  constructor(private cmsApiService: CmsApiService) {}

}
