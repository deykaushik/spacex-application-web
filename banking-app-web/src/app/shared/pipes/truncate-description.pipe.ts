import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../../core/utils/constants';

@Pipe({
  name: 'truncateDescription'
})
export class TruncateDescriptionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value && value.length > Constants.truncateDescCharLimit.charLimit) {
      value = value.slice(0, args) + '...';
    }
    return value;
  }
}

