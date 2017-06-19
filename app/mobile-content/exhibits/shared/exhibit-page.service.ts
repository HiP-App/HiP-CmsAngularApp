import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { ExhibitPage } from './exhibit-page.model';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';

@Injectable()
export class ExhibitPageService {

  constructor(private mobileApiService: MobileContentApiService) {}

  createPage(page: ExhibitPage): Promise<number> {
    return this.mobileApiService.postUrl(`/api/Exhibits/${page.exhibitId}/Pages`, JSON.stringify(page))
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError(error)
      );
  }

  getAllIds(): Promise<number[]> {
    return this.mobileApiService.getUrl('/api/Exhibits/Pages/ids')
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError(error)
      );
  }

  getAllIdsFor(id: number): Promise<number[]> {
    return this.mobileApiService.getUrl(`/api/Exhibits/${id}/Pages/ids`)
      .toPromise()
      .then(
        response => response.json()
      ).catch(
        error => this.handleError(error)
      );
  }

  getAllPages(): Promise<ExhibitPage[]> {
    return this.mobileApiService.getUrl('/api/Exhibits/Pages')
      .toPromise()
      .then(
        response => ExhibitPage.parseObjectArray(response.json().items)
      ).catch(
        error => this.handleError(error)
      );
  }

  getAllPagesFor(id: number): Promise<ExhibitPage[]> {
    return this.mobileApiService.getUrl(`/api/Exhibits/${id}/Pages`)
      .toPromise()
      .then(
        response => ExhibitPage.parseObjectArray(response.json().items)
      ).catch(
        error => this.handleError(error)
      );
  }

  getPage(id: number): Promise<ExhibitPage> {
    return this.mobileApiService.getUrl(`/api/Exhibits/Pages/${id}`)
      .toPromise()
      .then(
        response => ExhibitPage.parseObject(response.json())
      ).catch(
        error => this.handleError(error)
      );
  }

  private handleError(error: Response) {
    let message = error.status + ' ' + error.statusText;
    return Promise.reject(message);
  }
}
