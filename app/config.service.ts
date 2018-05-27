import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ConfigService {
  private CONFIG: any;

  constructor(private http: Http) {}

  public load() {
    return new Promise(
      (resolve: any) => {
        this.http.get('hip-config.json')
          .map(
            res => res.json()
          ).subscribe(
            config => {
              this.CONFIG = config;
              resolve();
            }
          );
      }
    );
  }

  public get(config: string): string {
    return this.CONFIG[config];
  }

  public getObject(config: string): any {
    return this.CONFIG[config];
  }
}
