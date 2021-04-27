import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../../core/utils/constants';

@Pipe({
   name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

   transform(content: any, query, cssClass): any {
      if (!query) {
         return content;
      }
      // Escaping Invalid characters
      const invalid = Constants.patterns.invalidCharacters;
      // Removing Invalid characters
      const trimmedQuery = query.toString().replace(invalid, '');
      // Passing Trimmed Query
      return content.replace(new RegExp(trimmedQuery, 'gi'), match => {
         return `<span class="${cssClass}">${match}</span>`;
      });
   }
}
