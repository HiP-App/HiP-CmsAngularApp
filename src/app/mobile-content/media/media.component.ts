import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupervisorGuard } from '../../shared/guards/supervisor-guard';


@Component({
  moduleId: module.id,
  selector: 'hip-media',
  templateUrl: 'media.component.html'
})
export class MediaComponent {
  isSupervisor: boolean;
  inDeletedPage: boolean;
  constructor(
              public router: Router,
              private supervisorGuard: SupervisorGuard) {
    if (router.url === '/mobile-content/media/deleted') {this.inDeletedPage = true; } else {this.inDeletedPage = false;
      this.getIsSupervisor();
    }
  }

  getIsSupervisor() {
    this.supervisorGuard.isSupervisor().then(
      (response: boolean) => {
        this.isSupervisor = response;
      });
  }
}
