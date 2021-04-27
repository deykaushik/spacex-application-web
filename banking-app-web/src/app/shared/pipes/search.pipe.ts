import { Pipe, PipeTransform } from '@angular/core';
import { ICountryListCheckboxDetails} from '../../core/services/models';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(items: ICountryListCheckboxDetails[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toUpperCase();
    return items.filter( item => {
      return item.countries.description.toUpperCase().startsWith(searchText);
    });
   }
}

