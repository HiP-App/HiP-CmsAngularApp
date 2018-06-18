import { ConfigService } from './../config.service';
import {Injectable} from '@angular/core';
import {LazyMapsAPILoaderConfigLiteral} from '@agm/core';

@Injectable()
export class MapsConfig implements LazyMapsAPILoaderConfigLiteral {
  public apiKey: string;
  public libraries: string[];
  constructor(config: ConfigService) {
    this.apiKey = config.get('googleMapsApiKey');
    this.libraries = ['places'];
  }
}
