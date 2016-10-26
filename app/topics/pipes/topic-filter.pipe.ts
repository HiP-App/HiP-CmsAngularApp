import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Topic } from '../../topics/shared/topic.model';

@Pipe({
  name: 'hipTopicsSearchPipe'
})

@Injectable()

export class TopicsFilterPipe implements PipeTransform {
  transform(topics: Topic[], query: string): Topic[] {
    if (query !== '' && query !== undefined && query.length >= 1 && topics !== null) {
      return topics.filter(topic =>
        (topic.title.toLowerCase().indexOf(query.toLowerCase()) !== -1));

    } else {
      return topics;
    }
  }
}


