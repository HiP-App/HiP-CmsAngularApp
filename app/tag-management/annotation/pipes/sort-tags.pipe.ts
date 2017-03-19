import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hipTagFrequencySorter'
})

@Injectable()
export class TagFrequencySorter implements PipeTransform {
  transform(tagFrequencies: any, key: string, direction: number): any[] {
    if (key !== '' && tagFrequencies !== null) {
      tagFrequencies.sort(
        (a: any, b: any) => {
          if (a[key] < b[key]) {
            return -1 * direction;
          } else if (a[key] > b[key]) {
            return 1 * direction;
          } else {
            return 0;
          }
        }
      );
    }
    return tagFrequencies;
  }
}
