import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hipDurationFilter'
})

@Injectable()
export class DurationsFilter implements PipeTransform {
  transform(duration: number) {
    if (duration) {
      duration = Math.floor((duration) / 60);
    }
    return duration;
  }
}
