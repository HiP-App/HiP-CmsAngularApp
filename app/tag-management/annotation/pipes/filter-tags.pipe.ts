import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hipTagsFilter'
})

@Injectable()
export class TagsFilter implements PipeTransform {
  transform(tagFrequencies: any[], query: string): any[] {
    if (query !== '' && query !== undefined && tagFrequencies !== null) {
      tagFrequencies = tagFrequencies.filter (
        tagFrequency => (tagFrequency.tagName != null && tagFrequency.tagName.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      );
    }
    return tagFrequencies;
  }
}
