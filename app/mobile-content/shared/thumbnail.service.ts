import { Injectable } from '@angular/core';
import { RequestOptions, ResponseContentType, Headers, Response } from '@angular/http';

import { ConfigService } from '../../config.service';
import { ThumbnailApiService } from './thumbnail-api.service';

export enum ThumbnailSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Default = ''
}

export enum ThumbnailMode {
  FillSquare = 'FillSquare',
  Uniform = 'Uniform',
  Default = ''
}

export enum ThumbnailFormat {
  Jpeg = 'Jpeg',
  Png = 'Png',
  Default = ''
}

@Injectable()
export class ThumbnailService {

  constructor(
    private thumbnailApiService: ThumbnailApiService
  ) { }

  /**
   * Download media file from the server
   * @param imageUrl the image url of the original image
   * @param thumbnailSize the size of the thumbnail. Original size if default.
   * @param thumbnailMode the resizing mode of the returned thumbnail
   * @param thumbnailFormat the image format of the returned thumbnail
   * @param viewImage as boolean for not downloading
   * @returns {Promise<void>} returns Void
   */
  public downloadFile(imageUrl: string, thumbnailSize: ThumbnailSize,
    thumbnailMode: ThumbnailMode, thumbnailFormat: ThumbnailFormat, viewImage: boolean) {
    let params = '?'
      + 'Url=' + encodeURIComponent(imageUrl)
      + '&Size=' + thumbnailSize
      + '&Mode=' + thumbnailMode
      + '&Format=' + thumbnailFormat;

    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.ArrayBuffer });

    return this.thumbnailApiService.getUrl('/api/Thumbnails' + params, options)
      .toPromise()
      .then(
      response => ThumbnailService.extractContent(response, viewImage)
      ).catch(
      error => ThumbnailService.handleError(error)
      );
  }

  /**
   * Extract the File from Response context and download it
   * @param res Response
   */
  private static extractContent(res: Response, viewImage: boolean) {
    let blob: Blob = res.blob();
    let mainHead = res.headers.get('content-disposition');
    let filename = mainHead.split(';')
      .map(x => x.trim())
      .map(
      s => {
        if (s.split('=')[0] === 'filename') {
          return s.split('=')[1];
        }
      }
      ).filter(x => x)[0];
    let url = window.URL.createObjectURL(blob);
    if (viewImage) {
      return blob;
    } else {
      let a = document.createElement('a');
      a.href = url;
      a.download = typeof (filename) === 'string' ? filename : 'download';
      a.target = '_blank';
      a.click();
      a.remove();
    }
  }

  private static handleError(error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }
}
